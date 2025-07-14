import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import * as HiIcons from 'react-icons/hi';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';
import SafeIcon from '../common/SafeIcon';
import { voiceCloningAPI, validateVoiceName, validateSampleText } from '../utils/voiceCloningApi';

const { FiMic, FiUpload, FiPlay, FiPause, FiX, FiCheck, FiClock, FiStar, 
       FiShield, FiZap, FiAlertTriangle, FiDownload, FiRefreshCw } = FiIcons;
const { HiOutlineWaveform, HiOutlineSpeakerWave } = HiIcons;
const { RiVoiceprintFill, RiRobot2Line, RiUserVoiceLine } = RiIcons;
const { BsWaveform, BsEarbuds } = BsIcons;
const { MdOutlineSettingsVoice } = MdIcons;

const VoiceCloningRedesigned = () => {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  // Voice cloning state
  const [voiceName, setVoiceName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clonedVoiceId, setClonedVoiceId] = useState(null);
  const [clonedVoiceName, setClonedVoiceName] = useState('');

  // Sample generation state
  const [sampleText, setSampleText] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Professional voices state
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showVoiceSelection, setShowVoiceSelection] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(false);

  // UI state
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('clone'); // 'clone' or 'professional'
  const [activeStep, setActiveStep] = useState(1); // 1: Record, 2: Clone, 3: Test

  // Refs
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // Constants
  const maxRecordingTime = 30;
  const minRecordingTime = 10;

  // Load available voices on component mount
  useEffect(() => {
    loadAvailableVoices();
  }, []);

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxRecordingTime) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Audio player event handlers
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        setError('Error playing audio sample.');
      };
    }
  }, [generatedAudio]);

  const loadAvailableVoices = async () => {
    try {
      setLoadingVoices(true);
      setError(null);
      // For demo purposes, using mock data
      const mockVoices = [
        {
          id: 'voice-1',
          name: 'Sarah',
          gender: 'Female',
          language: 'en-US',
          description: 'Warm and engaging voice perfect for fiction and storytelling',
          category: 'Fiction',
          accent: 'American',
          preview_url: 'https://resource.unmixr.com/sample_audio/f45177b6-db98-479a-b8f7-57a997014d31.mp3'
        },
        {
          id: 'voice-2',
          name: 'James',
          gender: 'Male',
          language: 'en-GB',
          description: 'Professional British voice ideal for business and educational content',
          category: 'Business',
          accent: 'British',
          preview_url: 'https://resource.unmixr.com/sample_audio/e9d18dad-b28c-4cba-b479-b73c684bc5c8.mp3'
        },
        {
          id: 'voice-3',
          name: 'Emma',
          gender: 'Female',
          language: 'en-US',
          description: 'Clear, educational voice perfect for tutorials and learning materials',
          category: 'Educational',
          accent: 'American',
          preview_url: 'https://resource.unmixr.com/sample_audio/0f2ef8ac-5da9-4400-ad89-dcf8c684f30c.mp3'
        }
      ];
      setTimeout(() => {
        setAvailableVoices(mockVoices);
        setLoadingVoices(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading voices:', error);
      setError('Failed to load available voices. Please refresh the page.');
      setLoadingVoices(false);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setSuccess(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      audioChunks.current = [];
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm'
      });

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        setAudioFile(null); // Clear uploaded file when recording

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      // Auto-stop after maxRecordingTime
      setTimeout(() => {
        if (mediaRecorder.current?.state === 'recording') {
          stopRecording();
        }
      }, maxRecordingTime * 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Unable to access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // For demo, just validate file type
      const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/x-wav', 'audio/webm'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload MP3 or WAV files only.');
      }
      
      setAudioFile(file);
      setAudioBlob(null); // Clear recording when uploading file
      setError(null);
      setSuccess(`File "${file.name}" uploaded successfully!`);
    } catch (error) {
      setError(error.message);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const cloneVoice = async () => {
    try {
      // Validate inputs
      if (!voiceName.trim()) {
        setError('Please enter a name for your voice clone.');
        return;
      }
      
      if (!audioBlob && !audioFile) {
        setError('Please record or upload an audio file first.');
        return;
      }

      setIsProcessing(true);
      setError(null);
      setSuccess(null);

      // Simulate API call with timeout
      setTimeout(() => {
        setClonedVoiceId('cloned-voice-123');
        setClonedVoiceName(voiceName);
        setSuccess(`Voice "${voiceName}" cloned successfully!`);
        setSampleText('Hello! This is a test of my cloned voice. How does it sound?');
        setIsProcessing(false);
        setActiveStep(3); // Move to Test step
      }, 2000);
    } catch (error) {
      console.error('Voice cloning error:', error);
      setError(error.message || 'An error occurred during voice cloning.');
      setIsProcessing(false);
    }
  };

  const generateSample = async () => {
    try {
      // Validate inputs
      if (!clonedVoiceId && !selectedVoice) {
        setError('Please clone your voice or select a professional voice first.');
        return;
      }
      
      if (!sampleText.trim()) {
        setError('Please enter some text to generate speech.');
        return;
      }

      setIsGeneratingSample(true);
      setError(null);
      setSuccess(null);

      // Simulate API call with timeout
      setTimeout(() => {
        // Use a sample audio URL for demo
        const sampleAudioUrl = clonedVoiceId 
          ? 'https://resource.unmixr.com/sample_audio/f45177b6-db98-479a-b8f7-57a997014d31.mp3'
          : selectedVoice?.preview_url;
        
        setGeneratedAudio(sampleAudioUrl);
        setSuccess('Speech sample generated successfully!');
        setIsGeneratingSample(false);
      }, 1500);
    } catch (error) {
      console.error('Sample generation error:', error);
      setError(error.message || 'An error occurred during sample generation.');
      setIsGeneratingSample(false);
    }
  };

  const playGeneratedSample = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const selectProfessionalVoice = (voice) => {
    setSelectedVoice(voice);
    setClonedVoiceId(null); // Clear cloned voice when selecting professional
    setVoiceName(voice.name);
    setSuccess(`Selected professional voice: ${voice.name}`);
    setSampleText('Hello! This is a test using a professional voice. How does it sound?');
    setActiveStep(3); // Move to Test step
  };

  const playPreviewVoice = async (voiceUrl, event) => {
    event.stopPropagation();
    try {
      const audio = new Audio(voiceUrl);
      audio.play();
    } catch (error) {
      console.error('Error playing preview:', error);
      setError('Unable to play voice preview.');
    }
  };

  const resetForm = () => {
    // Reset all state
    setAudioBlob(null);
    setAudioFile(null);
    setVoiceName('');
    setClonedVoiceId(null);
    setClonedVoiceName('');
    setSelectedVoice(null);
    setSampleText('');
    setGeneratedAudio(null);
    setIsPlaying(false);
    setRecordingTime(0);
    setError(null);
    setSuccess(null);
    setActiveStep(1);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const downloadSample = () => {
    if (generatedAudio) {
      const link = document.createElement('a');
      link.href = generatedAudio;
      link.download = `${clonedVoiceName || selectedVoice?.name || 'voice'}_sample.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStepStatus = (step) => {
    if (step < activeStep) return 'completed';
    if (step === activeStep) return 'current';
    return 'upcoming';
  };

  const renderStepIndicator = (step, label, icon) => {
    const status = getStepStatus(step);
    return (
      <div className="flex flex-col items-center">
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 
            ${status === 'completed' ? 'bg-green-500 text-white' : 
              status === 'current' ? 'bg-blue-500 text-white' : 
              'bg-gray-700 text-gray-400'}`}
        >
          {status === 'completed' ? (
            <SafeIcon icon={FiCheck} className="w-6 h-6" />
          ) : (
            <SafeIcon icon={icon} className="w-6 h-6" />
          )}
        </div>
        <span className={`text-sm font-medium 
          ${status === 'completed' ? 'text-green-400' : 
            status === 'current' ? 'text-blue-400' : 
            'text-gray-500'}`}
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center relative">
                    <div className="absolute inset-0">
                      <div className="absolute top-1 left-1 w-2 h-0.5 bg-green-400"></div>
                      <div className="absolute top-1 left-1 w-0.5 h-2 bg-green-400"></div>
                      <div className="absolute top-1 right-1 w-2 h-0.5 bg-blue-400"></div>
                      <div className="absolute top-1 right-1 w-0.5 h-2 bg-blue-400"></div>
                      <div className="absolute bottom-1 left-1 w-2 h-0.5 bg-yellow-400"></div>
                      <div className="absolute bottom-1 left-1 w-0.5 h-2 bg-yellow-400"></div>
                      <div className="absolute bottom-1 right-1 w-2 h-0.5 bg-purple-400"></div>
                      <div className="absolute bottom-1 right-1 w-0.5 h-2 bg-purple-400"></div>
                    </div>
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-[10px] font-extrabold text-primary-600">AS</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary-400">Audio</span>
                <span className="text-secondary-400">book</span>
                <span className="text-primary-400">Smith</span>
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <button 
                onClick={resetForm} 
                className="px-4 py-2 text-gray-300 hover:text-white font-medium flex items-center"
              >
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
                Reset
              </button>
              <Link 
                to="/voice-samples" 
                className="px-4 py-2 text-primary-400 hover:text-primary-300 font-medium"
              >
                Browse Voices
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Area */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <SafeIcon icon={RiVoiceprintFill} className="w-10 h-10 mr-3 text-blue-400" />
              Voice Cloning Studio
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create a digital twin of your voice with our advanced AI technology or choose from our professional voice library
            </p>
          </div>

          {/* Status Messages */}
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-red-300">{error}</div>
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-green-300">{success}</div>
            </motion.div>
          )}

          {/* Process Steps */}
          <div className="mb-10">
            <div className="flex justify-between max-w-2xl mx-auto">
              {renderStepIndicator(1, "Record", FiMic)}
              <div className="flex-1 flex items-center justify-center">
                <div className={`h-1 w-full ${getStepStatus(1) === 'completed' ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              </div>
              {renderStepIndicator(2, "Clone", RiRobot2Line)}
              <div className="flex-1 flex items-center justify-center">
                <div className={`h-1 w-full ${getStepStatus(2) === 'completed' ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              </div>
              {renderStepIndicator(3, "Test", HiOutlineSpeakerWave)}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-700">
              <button 
                onClick={() => {
                  setActiveTab('clone');
                  if (activeStep > 1) setActiveStep(1);
                }} 
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'clone' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <SafeIcon icon={RiUserVoiceLine} className="w-5 h-5 mr-2" />
                  Clone Your Voice
                </div>
              </button>
              <button 
                onClick={() => {
                  setActiveTab('professional');
                  setActiveStep(2);
                }} 
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'professional' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <SafeIcon icon={MdOutlineSettingsVoice} className="w-5 h-5 mr-2" />
                  Professional Voices
                </div>
              </button>
            </div>
          </div>

          {/* Main Workflow Area */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700">
              {activeTab === 'clone' ? (
                /* Voice Cloning Interface */
                <>
                  {activeStep === 1 && (
                    /* Step 1: Record */
                    <>
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                          <SafeIcon icon={FiMic} className="w-6 h-6 mr-2 text-blue-400" />
                          Record Your Voice
                        </h2>
                        <p className="text-gray-300">
                          Record or upload a sample of your voice to create a digital clone
                        </p>
                      </div>

                      {/* Recording Interface */}
                      <div className="flex flex-col items-center mb-10">
                        <div className="relative w-40 h-40 mb-6">
                          <div 
                            className={`absolute inset-0 rounded-full ${
                              isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
                            } flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30`}
                            onClick={isRecording ? stopRecording : startRecording}
                          >
                            <SafeIcon icon={isRecording ? FiX : FiMic} className="w-16 h-16 text-white" />
                          </div>
                          
                          {isRecording && (
                            <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                              <circle 
                                cx="50" cy="50" r="45" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="4" 
                                strokeDasharray="283" 
                                strokeDashoffset={283 * (1 - recordingTime / maxRecordingTime)} 
                                className="text-red-300" 
                              />
                            </svg>
                          )}
                          
                          {/* Waveform visualization for recording */}
                          {isRecording && (
                            <div className="absolute inset-x-0 bottom-0 flex justify-center">
                              <div className="flex items-end space-x-1 h-16">
                                {[...Array(20)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-1 bg-red-400 rounded-full"
                                    animate={{
                                      height: [4, 16, 8, 20, 6, 18, 10, 14, 4],
                                    }}
                                    transition={{
                                      duration: 1.2,
                                      repeat: Infinity,
                                      delay: i * 0.05,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-3xl font-bold mb-2 text-white">
                          {isRecording ? `${recordingTime}s` : audioBlob ? 'Recording Complete' : 'Start Recording'}
                        </div>
                        
                        <p className="text-gray-400 text-center max-w-sm">
                          {isRecording
                            ? `Recording... (${maxRecordingTime - recordingTime}s remaining)`
                            : audioBlob
                            ? 'Click to record again or continue to the next step'
                            : `Record ${minRecordingTime}-${maxRecordingTime} seconds of clear speech`}
                        </p>
                        
                        {audioBlob && (
                          <div className="mt-4 text-green-400 flex items-center">
                            <SafeIcon icon={FiCheck} className="w-5 h-5 mr-2" />
                            Recording ready
                          </div>
                        )}
                      </div>

                      {/* File Upload Alternative */}
                      <div className="mt-8">
                        <h3 className="text-xl font-medium text-white mb-4 flex items-center">
                          <SafeIcon icon={FiUpload} className="w-5 h-5 mr-2 text-blue-400" />
                          Or Upload Audio File
                        </h3>
                        
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                          <div className="text-center">
                            <SafeIcon icon={FiUpload} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <input 
                              ref={fileInputRef} 
                              type="file" 
                              accept="audio/*" 
                              onChange={handleFileUpload} 
                              className="hidden" 
                            />
                            
                            <button 
                              onClick={() => fileInputRef.current?.click()} 
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Choose Audio File
                            </button>
                            
                            <p className="text-xs text-gray-400 mt-2">
                              MP3, WAV (max 10MB, {minRecordingTime}-{maxRecordingTime}s recommended)
                            </p>
                          </div>
                          
                          {audioFile && (
                            <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded-lg">
                              <div className="text-sm text-green-400 flex items-center">
                                <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                                File: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Next Step Button */}
                      <button 
                        onClick={() => setActiveStep(2)} 
                        disabled={!audioBlob && !audioFile}
                        className="w-full mt-8 py-4 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                      >
                        Continue to Next Step
                      </button>
                    </>
                  )}

                  {activeStep === 2 && (
                    /* Step 2: Clone */
                    <>
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                          <SafeIcon icon={RiRobot2Line} className="w-6 h-6 mr-2 text-blue-400" />
                          Clone Your Voice
                        </h2>
                        <p className="text-gray-300">
                          Create a digital twin of your voice using AI
                        </p>
                      </div>

                      {/* Voice Name Input */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Voice Name *
                        </label>
                        <input 
                          type="text" 
                          value={voiceName} 
                          onChange={(e) => setVoiceName(e.target.value)} 
                          placeholder="Enter a name for your voice (e.g., 'My Narrator Voice')"
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          maxLength={50}
                        />
                        <p className="text-xs text-gray-400 mt-1">{voiceName.length}/50 characters</p>
                      </div>

                      {/* Audio Status */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-white mb-4">Audio Status</h3>
                        <div className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mr-4">
                              <SafeIcon icon={audioBlob ? FiMic : FiUpload} className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {audioBlob ? 'Recorded Audio' : audioFile ? 'Uploaded File' : 'No Audio'}
                              </div>
                              <div className="text-sm text-gray-400">
                                {audioBlob
                                  ? `${recordingTime}s recording`
                                  : audioFile
                                  ? `${audioFile.name} (${(audioFile.size / 1024 / 1024).toFixed(2)} MB)`
                                  : 'Please record or upload audio first'}
                              </div>
                            </div>
                            <div className="ml-auto">
                              <div className="px-3 py-1 bg-green-900/50 text-green-400 text-sm rounded-full">
                                Ready
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Information Box */}
                      <div className="mb-8 p-4 border border-blue-800 bg-blue-900/20 rounded-lg">
                        <div className="flex items-start">
                          <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-blue-300">
                            <div className="font-medium mb-1">Voice Cloning Guidelines</div>
                            <ul className="space-y-1 list-disc pl-4">
                              <li>Speak clearly and at a natural pace</li>
                              <li>Record in a quiet environment with minimal background noise</li>
                              <li>Vary your tone and expression for better results</li>
                              <li>Your voice data is processed securely and privately</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Clone Button */}
                      <button 
                        onClick={cloneVoice} 
                        disabled={isProcessing || (!audioBlob && !audioFile) || !voiceName.trim()}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg shadow-blue-600/20"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                            Cloning Voice...
                          </>
                        ) : (
                          <>
                            <SafeIcon icon={FiZap} className="w-6 h-6 mr-3" />
                            Clone My Voice
                          </>
                        )}
                      </button>

                      {/* Back Button */}
                      <button
                        onClick={() => setActiveStep(1)}
                        className="w-full mt-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Back to Recording
                      </button>
                    </>
                  )}
                </>
              ) : (
                /* Professional Voices Interface */
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                      <SafeIcon icon={MdOutlineSettingsVoice} className="w-6 h-6 mr-2 text-blue-400" />
                      Professional Voices
                    </h2>
                    <p className="text-gray-300">
                      Choose from our library of high-quality AI voices
                    </p>
                  </div>

                  {loadingVoices ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3" />
                      <span className="text-gray-300">Loading voices...</span>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {availableVoices.map((voice) => (
                        <div 
                          key={voice.id} 
                          className={`border rounded-lg p-6 cursor-pointer transition-all ${
                            selectedVoice?.id === voice.id 
                              ? 'border-blue-500 bg-blue-900/20 ring-2 ring-blue-500/20' 
                              : 'border-gray-700 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                          onClick={() => selectProfessionalVoice(voice)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-gray-700">
                                <div className="text-xl font-bold text-blue-400">
                                  {voice.name.charAt(0)}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white text-lg">{voice.name}</h4>
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                  <span>{voice.gender}</span>
                                  <span>•</span>
                                  <span>{voice.accent}</span>
                                </div>
                              </div>
                            </div>

                            {/* Play Button */}
                            {voice.preview_url && (
                              <button 
                                onClick={(e) => playPreviewVoice(voice.preview_url, e)} 
                                className="ml-4 p-2 text-blue-400 hover:bg-blue-900/30 rounded-full transition-colors"
                                title="Play preview"
                              >
                                <SafeIcon icon={FiPlay} className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                          {/* Voice Details */}
                          <div className="mt-3 text-sm text-gray-300">
                            <p>{voice.description}</p>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-400 rounded-full">
                              {voice.category}
                            </span>
                            <span className="text-xs px-2 py-1 bg-purple-900/50 text-purple-400 rounded-full">
                              {voice.language}
                            </span>
                          </div>

                          {selectedVoice?.id === voice.id && (
                            <div className="mt-3 p-2 bg-blue-900/30 rounded text-sm text-blue-400 flex items-center">
                              <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                              Selected for speech generation
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {availableVoices.length === 0 && !loadingVoices && (
                    <div className="text-center py-12">
                      <SafeIcon icon={FiAlertTriangle} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300">No professional voices available at the moment.</p>
                      <button 
                        onClick={loadAvailableVoices} 
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Panel - Sample Generation */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                  <SafeIcon icon={HiOutlineSpeakerWave} className="w-6 h-6 mr-2 text-blue-400" />
                  Test Your Voice
                </h2>
                <p className="text-gray-300">
                  Generate a speech sample to hear the results
                </p>
              </div>

              {/* Voice Status */}
              {(clonedVoiceId || selectedVoice) ? (
                <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <div className="flex items-start">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-green-400 font-medium">
                        {clonedVoiceId ? 'Voice Cloned!' : 'Voice Selected!'}
                      </div>
                      <div className="text-green-300 text-sm">
                        {clonedVoiceId 
                          ? `"${clonedVoiceName}" is ready for speech generation` 
                          : `"${selectedVoice.name}" is ready for speech generation`}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <div className="flex items-start">
                    <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-blue-400 font-medium">No Voice Available Yet</div>
                      <div className="text-blue-300 text-sm">
                        {activeTab === 'clone' 
                          ? 'Complete the voice cloning process first' 
                          : 'Select a professional voice from the library'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sample Text Input */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Sample Text *
                </label>
                <textarea 
                  value={sampleText} 
                  onChange={(e) => setSampleText(e.target.value)} 
                  placeholder="Enter text to generate speech sample (10-1000 characters)..."
                  className="w-full h-36 p-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{sampleText.length}/1000 characters</span>
                  <span>{sampleText.split(' ').filter(word => word.length > 0).length} words</span>
                </div>

                {/* Generate Button */}
                <button 
                  onClick={generateSample} 
                  disabled={isGeneratingSample || (!clonedVoiceId && !selectedVoice) || !sampleText.trim()}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg shadow-blue-600/20"
                >
                  {isGeneratingSample ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={HiOutlineSpeakerWave} className="w-6 h-6 mr-3" />
                      Generate Sample
                    </>
                  )}
                </button>

                {/* Generated Sample Player */}
                {generatedAudio && (
                  <motion.div 
                    className="mt-6 p-6 bg-gray-700 rounded-lg border border-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-white text-lg flex items-center">
                        <SafeIcon icon={BsWaveform} className="w-5 h-5 mr-2 text-blue-400" />
                        Generated Sample
                      </h4>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={downloadSample} 
                          className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full transition-colors"
                          title="Download sample"
                        >
                          <SafeIcon icon={FiDownload} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Waveform Visualization */}
                    <div className="mb-4 h-20 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                      <div className="flex items-end space-x-1 h-16">
                        {[...Array(40)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-blue-400 rounded-full"
                            animate={{
                              height: isPlaying 
                                ? [4, 16, 8, 20, 6, 18, 10, 14, 4].map(h => h * (Math.sin(i * 0.2) + 1.2))
                                : 4
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.05,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Audio Controls */}
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={playGeneratedSample} 
                        className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                      >
                        <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-6 h-6" />
                      </button>
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {clonedVoiceId 
                            ? `${clonedVoiceName} (Cloned Voice)` 
                            : `${selectedVoice?.name} (Professional Voice)`}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center">
                          <SafeIcon icon={BsEarbuds} className="w-3 h-3 mr-1" />
                          <span>{isPlaying ? 'Playing...' : 'Ready to play'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hidden Audio Element */}
                    <audio 
                      ref={audioRef} 
                      src={generatedAudio} 
                      preload="metadata" 
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-300 text-sm">
                Your voice data is encrypted and processed securely. We never share your recordings or use them for other purposes.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <SafeIcon icon={FiZap} className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300 text-sm">
                Voice cloning completed in minutes, speech generation in seconds. Get your audiobook narration ready quickly.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <SafeIcon icon={FiStar} className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Studio Quality</h3>
              <p className="text-gray-300 text-sm">
                Professional-grade voice synthesis technology produces natural-sounding narration indistinguishable from human recordings.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <motion.div 
            className="mt-16 bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-white text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Create Your Audiobook?</h3>
            <p className="text-lg opacity-90 mb-6">
              Use your cloned voice or selected professional voice to create a full audiobook with studio-quality results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/#pricing" 
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                <SafeIcon icon={FiZap} className="w-5 h-5 mr-2" />
                Choose Your Plan
              </Link>
              <Link 
                to="/#transform-form" 
                className="inline-flex items-center px-8 py-4 bg-blue-600/30 backdrop-blur-sm text-white border border-blue-500/30 font-semibold rounded-lg hover:bg-blue-600/50 transition-all"
              >
                Start Free Sample
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AS</span>
              </div>
              <span className="text-lg font-bold text-white">AudiobookSmith</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 AudiobookSmith. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VoiceCloningRedesigned;