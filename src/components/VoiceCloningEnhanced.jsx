import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { voiceCloningAPI, validateVoiceName, validateSampleText } from '../utils/voiceCloningApi';

const { 
  FiMic, FiUpload, FiPlay, FiPause, FiX, FiCheck, FiClock, FiStar, 
  FiShield, FiZap, FiAlertTriangle, FiLoader, FiDownload, FiRefreshCw 
} = FiIcons;

const VoiceCloningEnhanced = () => {
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
      
      const response = await voiceCloningAPI.getAvailableVoices();
      
      if (response.success) {
        setAvailableVoices(response.voices || []);
      } else {
        throw new Error(response.message || 'Failed to load voices');
      }
    } catch (error) {
      console.error('Error loading voices:', error);
      setError('Failed to load available voices. Please refresh the page.');
    } finally {
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
      voiceCloningAPI.validateAudioFile(file);
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
      const validatedName = validateVoiceName(voiceName);
      
      if (!audioBlob && !audioFile) {
        setError('Please record or upload an audio file first.');
        return;
      }

      setIsProcessing(true);
      setError(null);
      setSuccess(null);

      let fileToUpload;
      
      if (audioFile) {
        fileToUpload = audioFile;
      } else if (audioBlob) {
        fileToUpload = await voiceCloningAPI.prepareAudioForUpload(audioBlob, `${validatedName}_recording.wav`);
      }

      // Validate audio duration
      try {
        const duration = await voiceCloningAPI.getAudioDuration(fileToUpload);
        if (duration < minRecordingTime) {
          throw new Error(`Audio must be at least ${minRecordingTime} seconds long. Current duration: ${duration.toFixed(1)}s`);
        }
      } catch (durationError) {
        setError(durationError.message);
        return;
      }

      const response = await voiceCloningAPI.cloneVoice(fileToUpload, validatedName);

      if (response.success) {
        setClonedVoiceId(response.voice_id);
        setClonedVoiceName(response.voice_name);
        setSuccess(`Voice "${response.voice_name}" cloned successfully!`);
        setSampleText('Hello! This is a test of my cloned voice. How does it sound?');
      } else {
        throw new Error(response.message || 'Failed to clone voice');
      }
    } catch (error) {
      console.error('Voice cloning error:', error);
      setError(error.message || 'An error occurred during voice cloning.');
    } finally {
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

      const validatedText = validateSampleText(sampleText);
      const voiceId = clonedVoiceId || selectedVoice?.voice_id;

      setIsGeneratingSample(true);
      setError(null);
      setSuccess(null);

      const response = await voiceCloningAPI.generateSample(voiceId, validatedText);

      if (response.success) {
        setGeneratedAudio(response.audio_url);
        setSuccess('Speech sample generated successfully!');
      } else {
        throw new Error(response.message || 'Failed to generate speech sample');
      }
    } catch (error) {
      console.error('Sample generation error:', error);
      setError(error.message || 'An error occurred during sample generation.');
    } finally {
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
  };

  const playPreviewVoice = async (voiceUrl) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
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
                <span className="text-primary-600">Audio</span>
                <span className="text-secondary-600">book</span>
                <span className="text-primary-600">Smith</span>
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center"
              >
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
                Reset
              </button>
              <Link to="/voice-samples" className="px-4 py-2 text-primary-600 hover:text-primary-800 font-medium">
                Browse Voices
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional Voice Cloning
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Create a digital twin of your voice or choose from our library of professional voices. 
              Perfect for authors who want complete control over their audiobook narration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Status Messages */}
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-red-700">{error}</div>
            </motion.div>
          )}

          {success && (
            <motion.div 
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-green-700">{success}</div>
            </motion.div>
          )}

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-lg border">
              <button
                onClick={() => setActiveTab('clone')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'clone'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Clone Your Voice
              </button>
              <button
                onClick={() => setActiveTab('professional')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'professional'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Professional Voices
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Voice Selection/Cloning Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              
              {activeTab === 'clone' ? (
                /* Voice Cloning Interface */
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Clone Your Voice</h2>
                    <p className="text-gray-600">
                      Record or upload a sample of your voice to create a digital clone
                    </p>
                  </div>

                  {/* Voice Name Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voice Name *
                    </label>
                    <input
                      type="text"
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      placeholder="Enter a name for your voice (e.g., 'John's Voice')"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500 mt-1">{voiceName.length}/50 characters</p>
                  </div>

                  {/* Recording Interface */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Record Your Voice</h3>
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative w-32 h-32 mb-4">
                        <div
                          className={`absolute inset-0 rounded-full ${
                            isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary-500'
                          } flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105`}
                          onClick={isRecording ? stopRecording : startRecording}
                        >
                          <SafeIcon icon={isRecording ? FiX : FiMic} className="w-12 h-12 text-white" />
                        </div>
                        {isRecording && (
                          <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="6"
                              strokeDasharray="283"
                              strokeDashoffset={283 * (1 - recordingTime / maxRecordingTime)}
                              className="text-red-300"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="text-2xl font-bold mb-2">
                        {isRecording ? `${recordingTime}s` : audioBlob ? 'Recording Complete' : 'Start Recording'}
                      </div>
                      <p className="text-gray-500 text-sm text-center">
                        {isRecording 
                          ? `Recording... (${maxRecordingTime - recordingTime}s remaining)` 
                          : audioBlob 
                            ? 'Click to record again' 
                            : `Record ${minRecordingTime}-${maxRecordingTime} seconds of clear speech`}
                      </p>
                      {audioBlob && (
                        <div className="mt-2 text-sm text-green-600">
                          ✓ Recording ready for cloning
                        </div>
                      )}
                    </div>
                  </div>

                  {/* File Upload Alternative */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Or Upload Audio File</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
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
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Choose Audio File
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          MP3, WAV (max 10MB, {minRecordingTime}-{maxRecordingTime}s recommended)
                        </p>
                      </div>
                      {audioFile && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-green-800">
                            ✓ File: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Clone Button */}
                  <button
                    onClick={cloneVoice}
                    disabled={isProcessing || (!audioBlob && !audioFile) || !voiceName.trim()}
                    className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
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
                </>
              ) : (
                /* Professional Voices Interface */
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Voices</h2>
                    <p className="text-gray-600">
                      Choose from our library of high-quality AI voices
                    </p>
                  </div>

                  {loadingVoices ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mr-3" />
                      <span className="text-gray-600">Loading voices...</span>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {availableVoices.map((voice) => (
                        <div
                          key={voice.voice_id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedVoice?.voice_id === voice.voice_id 
                              ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                          onClick={() => selectProfessionalVoice(voice)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{voice.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {voice.gender} • {voice.language}
                              </p>
                              <p className="text-xs text-gray-500 mb-2">{voice.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {voice.use_cases?.slice(0, 3).map((useCase, idx) => (
                                  <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                    {useCase}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {voice.preview_url && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playPreviewVoice(voice.preview_url);
                                }}
                                className="ml-4 p-2 text-primary-500 hover:bg-primary-100 rounded-full transition-colors"
                                title="Play preview"
                              >
                                <SafeIcon icon={FiPlay} className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          {selectedVoice?.voice_id === voice.voice_id && (
                            <div className="mt-3 p-2 bg-primary-100 rounded text-sm text-primary-700">
                              ✓ Selected for speech generation
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {availableVoices.length === 0 && !loadingVoices && (
                    <div className="text-center py-12">
                      <SafeIcon icon={FiAlertTriangle} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No professional voices available at the moment.</p>
                      <button
                        onClick={loadAvailableVoices}
                        className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sample Generation Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Your Voice</h2>
                <p className="text-gray-600">
                  Generate a speech sample to hear the results
                </p>
              </div>

              {/* Voice Status */}
              {(clonedVoiceId || selectedVoice) && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-green-700 font-medium">
                        {clonedVoiceId ? 'Voice Cloned!' : 'Voice Selected!'}
                      </div>
                      <div className="text-green-600 text-sm">
                        {clonedVoiceId 
                          ? `"${clonedVoiceName}" is ready for speech generation`
                          : `"${selectedVoice.name}" is ready for speech generation`
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sample Text Input */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Sample Text *
                </label>
                <textarea
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  placeholder="Enter text to generate speech sample (10-1000 characters)..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{sampleText.length}/1000 characters</span>
                  <span>{sampleText.split(' ').filter(word => word.length > 0).length} words</span>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateSample}
                  disabled={isGeneratingSample || (!clonedVoiceId && !selectedVoice) || !sampleText.trim()}
                  className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                  {isGeneratingSample ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiPlay} className="w-6 h-6 mr-3" />
                      Generate Sample
                    </>
                  )}
                </button>

                {/* Generated Sample Player */}
                {generatedAudio && (
                  <motion.div 
                    className="mt-6 p-6 bg-gray-50 rounded-lg border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Generated Sample</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={downloadSample}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
                          title="Download sample"
                        >
                          <SafeIcon icon={FiDownload} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={playGeneratedSample}
                        className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                      >
                        <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-5 h-5" />
                      </button>
                      
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Voice Sample</div>
                        <div className="text-xs text-gray-500">
                          {clonedVoiceId 
                            ? `${clonedVoiceName} (Cloned Voice)`
                            : `${selectedVoice?.name} (Professional Voice)`
                          }
                        </div>
                      </div>
                      
                      {/* Audio Waveform when playing */}
                      {isPlaying && (
                        <div className="flex items-center space-x-1">
                          {[...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-primary-400 rounded-full"
                              animate={{
                                height: [4, 16, 8, 20, 6, 18, 10, 14, 4],
                              }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.08,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Hidden Audio Element */}
                    <audio
                      ref={audioRef}
                      src={generatedAudio}
                      preload="metadata"
                    />
                  </motion.div>
                )}

                {/* Help Text */}
                {!clonedVoiceId && !selectedVoice && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700 text-sm">
                      💡 Clone your voice or select a professional voice first to generate speech samples.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            className="mt-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white text-center"
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
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
              >
                <SafeIcon icon={FiZap} className="w-5 h-5 mr-2" />
                Choose Your Plan
              </Link>
              <Link
                to="/#transform-form"
                className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all"
              >
                Start Free Sample
              </Link>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-primary-500" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure & Private</h4>
              <p className="text-sm text-gray-600">Your voice data is encrypted and processed securely. We never share your recordings.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiZap} className="w-6 h-6 text-primary-500" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600">Voice cloning completed in minutes, speech generation in seconds.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiStar} className="w-6 h-6 text-primary-500" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Studio Quality</h4>
              <p className="text-sm text-gray-600">Professional-grade voice synthesis indistinguishable from human narration.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VoiceCloningEnhanced;