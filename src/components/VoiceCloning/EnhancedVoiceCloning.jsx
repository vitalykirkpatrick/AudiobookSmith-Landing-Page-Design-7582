import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import VoiceRecorder from './VoiceRecorder';
import { elevenlabsApi } from '../../utils/elevenlabsApi';
import { unmixrAPI } from '../../utils/unmixrApi';
import { elevenlabsVoices, permissionText } from '../../utils/elevenlabsVoices';
import supabase from '../../lib/supabase';

const { FiMic, FiUpload, FiPlay, FiPause, FiX, FiCheck, FiLoader, FiAlertTriangle, FiInfo, FiDownload, FiRefreshCw, FiArrowLeft, FiUser } = FiIcons;

const EnhancedVoiceCloning = () => {
  // UI state
  const [activeTab, setActiveTab] = useState('clone'); // 'clone' or 'predefined'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Personal voice cloning state
  const [voiceName, setVoiceName] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileUrl, setAudioFileUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [clonedVoiceId, setClonedVoiceId] = useState(null);
  const [isProcessingClone, setIsProcessingClone] = useState(false);

  // Audio playback state
  const [isPlayingUploadedFile, setIsPlayingUploadedFile] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);

  // Predefined voice state
  const [availablePredefinedVoices, setAvailablePredefinedVoices] = useState([]);
  const [selectedPredefinedVoice, setSelectedPredefinedVoice] = useState(null);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [currentPreviewingVoice, setCurrentPreviewingVoice] = useState(null);

  // Text generation state
  const [sampleText, setSampleText] = useState(
    "Welcome to AudiobookSmith! I'm excited to help bring your stories to life with professional-quality narration that sounds natural and engaging."
  );
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingGenerated, setIsPlayingGenerated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Refs
  const fileInputRef = useRef(null);
  const audioPlayerRef = useRef(new Audio());
  const previewPlayerRef = useRef(new Audio());
  const uploadedFilePlayerRef = useRef(new Audio());
  const recordingPlayerRef = useRef(new Audio());
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Constants
  const MAX_RECORDING_TIME = 30; // seconds
  const MIN_RECORDING_TIME = 10; // seconds
  const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB

  // Load user info and predefined voices on mount
  useEffect(() => {
    checkUserSession();
    if (activeTab === 'predefined') {
      loadPredefinedVoices();
    }
  }, [activeTab]);

  // Check if user is logged in
  const checkUserSession = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    }
  };

  // Load predefined voices
  const loadPredefinedVoices = async () => {
    try {
      setLoadingVoices(true);
      setError(null);
      
      // In a real implementation, this would call the Unmixr API
      // const response = await unmixrAPI.getVoices();
      // For now, we'll use our local data
      setAvailablePredefinedVoices(elevenlabsVoices);
    } catch (error) {
      console.error('Failed to load predefined voices:', error);
      setError('Unable to load voice library. Please try again later.');
    } finally {
      setLoadingVoices(false);
    }
  };

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Audio player event handlers
  useEffect(() => {
    const audioPlayer = audioPlayerRef.current;
    const previewPlayer = previewPlayerRef.current;
    const uploadedFilePlayer = uploadedFilePlayerRef.current;
    const recordingPlayer = recordingPlayerRef.current;

    // Generated audio player handlers
    const handleGeneratedEnded = () => setIsPlayingGenerated(false);
    const handleGeneratedError = () => {
      setIsPlayingGenerated(false);
      setError('Error playing generated audio. Please try again.');
    };
    
    // Preview player handlers
    const handlePreviewEnded = () => setCurrentPreviewingVoice(null);
    const handlePreviewError = () => {
      setCurrentPreviewingVoice(null);
      setError('Error playing voice preview.');
    };

    // Uploaded file player handlers
    const handleUploadedFileEnded = () => setIsPlayingUploadedFile(false);
    const handleUploadedFileError = () => {
      setIsPlayingUploadedFile(false);
      setError('Error playing uploaded file.');
    };

    // Recording player handlers
    const handleRecordingEnded = () => setIsPlayingRecording(false);
    const handleRecordingError = () => {
      setIsPlayingRecording(false);
      setError('Error playing recording.');
    };

    // Add event listeners
    audioPlayer.addEventListener('ended', handleGeneratedEnded);
    audioPlayer.addEventListener('error', handleGeneratedError);
    
    previewPlayer.addEventListener('ended', handlePreviewEnded);
    previewPlayer.addEventListener('error', handlePreviewError);
    
    uploadedFilePlayer.addEventListener('ended', handleUploadedFileEnded);
    uploadedFilePlayer.addEventListener('error', handleUploadedFileError);
    
    recordingPlayer.addEventListener('ended', handleRecordingEnded);
    recordingPlayer.addEventListener('error', handleRecordingError);

    return () => {
      // Remove event listeners
      audioPlayer.removeEventListener('ended', handleGeneratedEnded);
      audioPlayer.removeEventListener('error', handleGeneratedError);
      
      previewPlayer.removeEventListener('ended', handlePreviewEnded);
      previewPlayer.removeEventListener('error', handlePreviewError);
      
      uploadedFilePlayer.removeEventListener('ended', handleUploadedFileEnded);
      uploadedFilePlayer.removeEventListener('error', handleUploadedFileError);
      
      recordingPlayer.removeEventListener('ended', handleRecordingEnded);
      recordingPlayer.removeEventListener('error', handleRecordingError);
      
      // Cleanup audio
      audioPlayer.pause();
      previewPlayer.pause();
      uploadedFilePlayer.pause();
      recordingPlayer.pause();
    };
  }, []);

  // Start recording
  const startRecording = async () => {
    try {
      // Reset state
      setError(null);
      setAudioBlob(null);
      setAudioBlobUrl(null);
      setAudioFile(null);
      setAudioFileUrl(null);
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });

      // Create media recorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });

      // Set up event handlers
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(audioBlob);

        // Create URL for playback
        const blobUrl = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(blobUrl);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());

        // Check recording length
        if (recordingTime < MIN_RECORDING_TIME) {
          setError(`Recording must be at least ${MIN_RECORDING_TIME} seconds long. Please try again.`);
          return;
        }

        // Create file from blob for upload
        const file = new File([audioBlob], `recording-${Date.now()}.${mimeType.split('/')[1]}`, {
          type: mimeType
        });
        setAudioFile(file);
      };

      // Start recording
      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      // Auto-stop after max time
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, MAX_RECORDING_TIME * 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Unable to access microphone. Please check permissions and try again.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Validate file type
      const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/x-wav', 'audio/webm'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload MP3, WAV, or WebM files only.');
      }

      // Validate file size
      if (file.size > MAX_AUDIO_SIZE) {
        throw new Error(`File size must be less than ${MAX_AUDIO_SIZE / 1024 / 1024}MB.`);
      }

      // Clean up previous audio blob URL
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
      }
      
      // Reset recording state
      setAudioBlob(null);
      setAudioBlobUrl(null);
      
      // Set file and create URL for playback
      setAudioFile(file);
      const fileUrl = URL.createObjectURL(file);
      setAudioFileUrl(fileUrl);
      
      setError(null);
      setSuccess(`File "${file.name}" uploaded successfully!`);
    } catch (error) {
      setError(error.message);
      setAudioFile(null);
      setAudioFileUrl(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Play uploaded file
  const playUploadedFile = () => {
    if (!audioFileUrl) return;
    
    // Stop all other audio
    stopAllAudio();
    
    if (isPlayingUploadedFile) {
      uploadedFilePlayerRef.current.pause();
      uploadedFilePlayerRef.current.currentTime = 0;
      setIsPlayingUploadedFile(false);
    } else {
      uploadedFilePlayerRef.current.src = audioFileUrl;
      uploadedFilePlayerRef.current.play()
        .then(() => setIsPlayingUploadedFile(true))
        .catch(error => {
          console.error('Error playing uploaded file:', error);
          setError('Unable to play uploaded file. Please try again.');
        });
    }
  };

  // Play recording
  const playRecording = () => {
    if (!audioBlobUrl) return;
    
    // Stop all other audio
    stopAllAudio();
    
    if (isPlayingRecording) {
      recordingPlayerRef.current.pause();
      recordingPlayerRef.current.currentTime = 0;
      setIsPlayingRecording(false);
    } else {
      recordingPlayerRef.current.src = audioBlobUrl;
      recordingPlayerRef.current.play()
        .then(() => setIsPlayingRecording(true))
        .catch(error => {
          console.error('Error playing recording:', error);
          setError('Unable to play recording. Please try again.');
        });
    }
  };

  // Stop all audio playback
  const stopAllAudio = () => {
    // Stop generated audio
    audioPlayerRef.current.pause();
    audioPlayerRef.current.currentTime = 0;
    setIsPlayingGenerated(false);
    
    // Stop preview audio
    previewPlayerRef.current.pause();
    previewPlayerRef.current.currentTime = 0;
    setCurrentPreviewingVoice(null);
    
    // Stop uploaded file audio
    uploadedFilePlayerRef.current.pause();
    uploadedFilePlayerRef.current.currentTime = 0;
    setIsPlayingUploadedFile(false);
    
    // Stop recording audio
    recordingPlayerRef.current.pause();
    recordingPlayerRef.current.currentTime = 0;
    setIsPlayingRecording(false);
  };

  // Clone voice using ElevenLabs API
  const cloneVoice = async () => {
    try {
      // Validate inputs
      if (!voiceName.trim()) {
        setError('Please enter a name for your voice.');
        return;
      }
      
      if (!audioFile && !audioBlob) {
        setError('Please record or upload an audio file first.');
        return;
      }

      // Start processing
      setIsProcessingClone(true);
      setError(null);
      setSuccess(null);

      // In a real implementation, this would call the ElevenLabs API
      // const formData = new FormData();
      // formData.append('name', voiceName.trim());
      // formData.append('description', 'Voice cloned via AudiobookSmith');
      // formData.append('files', audioFile || new File([audioBlob], 'recording.wav', {type: 'audio/wav'}));
      
      // const response = await elevenlabsApi.addVoice(formData);
      // if (response.voice_id) {
      //   setClonedVoiceId(response.voice_id);
      // } else {
      //   throw new Error('Failed to clone voice. Please try again.');
      // }
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock voice ID
      const mockVoiceId = `cloned-voice-${Date.now()}`;
      
      // Update state
      setClonedVoiceId(mockVoiceId);
      setSelectedPredefinedVoice(null);
      setSuccess(`Voice "${voiceName}" has been successfully cloned! You can now generate speech.`);
      
      // Set default sample text
      setSampleText(`Hello! This is ${voiceName}, your personal AI voice clone. How do I sound to you? Feel free to type any text and I'll read it in your voice.`);
    } catch (error) {
      console.error('Error cloning voice:', error);
      setError(error.message || 'Failed to clone voice. Please try again later.');
    } finally {
      setIsProcessingClone(false);
    }
  };

  // Select a predefined voice
  const selectPredefinedVoice = (voice) => {
    setSelectedPredefinedVoice(voice);
    setClonedVoiceId(null);
    setSuccess(`Selected voice: ${voice.name}`);
    
    // Set customized sample text for this voice
    setSampleText(`Hello, I'm ${voice.name}. ${voice.description} I would be perfect for your audiobook project.`);
  };

  // Preview a predefined voice
  const previewVoice = async (voice, event) => {
    event.stopPropagation(); // Prevent selecting the voice when clicking the preview button
    
    try {
      // Stop all audio
      stopAllAudio();
      
      // Stop current preview if playing
      if (currentPreviewingVoice === voice.id) {
        previewPlayerRef.current.pause();
        previewPlayerRef.current.currentTime = 0;
        setCurrentPreviewingVoice(null);
        return;
      }
      
      // Set preview URL
      previewPlayerRef.current.src = voice.preview_url;
      
      // Play preview
      await previewPlayerRef.current.play();
      setCurrentPreviewingVoice(voice.id);
    } catch (error) {
      console.error('Error previewing voice:', error);
      setError('Unable to play voice preview.');
    }
  };

  // Generate speech sample
  const generateSpeech = async () => {
    try {
      // Validate inputs
      if (!clonedVoiceId && !selectedPredefinedVoice) {
        setError('Please clone your voice or select a predefined voice first.');
        return;
      }
      
      if (!sampleText.trim()) {
        setError('Please enter text to generate speech.');
        return;
      }
      
      // Start generating
      setIsGenerating(true);
      setError(null);
      setSuccess(null);

      // Stop any playing audio
      stopAllAudio();

      let audioUrl;
      
      if (clonedVoiceId) {
        // Using ElevenLabs API for cloned voice
        // In a real implementation, this would call the ElevenLabs API
        // const response = await elevenlabsApi.generateSpeech(clonedVoiceId, sampleText);
        // audioUrl = URL.createObjectURL(response);
        
        // For demo purposes, simulate API call with a real voice sample (not bell sound)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Use one of the real voice samples as the result instead of the bell sound
        audioUrl = 'https://resource.unmixr.com/sample_audio/e9d18dad-b28c-4cba-b479-b73c684bc5c8.mp3';
      } else {
        // Using Unmixr API for predefined voice
        // In a real implementation, this would call the Unmixr API
        // const result = await unmixrAPI.generateSample(selectedPredefinedVoice.id, sampleText);
        // if (result.job_id) {
        //   let jobStatus = await unmixrAPI.getJobStatus(result.job_id);
        //   while (jobStatus.status === 'processing') {
        //     await new Promise(resolve => setTimeout(resolve, 1000));
        //     jobStatus = await unmixrAPI.getJobStatus(result.job_id);
        //   }
        //   if (jobStatus.status === 'completed' && jobStatus.audio_url) {
        //     audioUrl = jobStatus.audio_url;
        //   } else {
        //     throw new Error('Failed to generate speech sample');
        //   }
        // }
        
        // For demo purposes, simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Use the preview URL of the selected voice as the result
        audioUrl = selectedPredefinedVoice.preview_url;
      }
      
      // Update state with the audio URL
      setGeneratedAudio(audioUrl);
      setSuccess('Speech generated successfully!');
      
      // Set up audio player
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.load();
    } catch (error) {
      console.error('Error generating speech:', error);
      setError(error.message || 'Failed to generate speech. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Play/pause generated speech
  const togglePlay = () => {
    if (!audioPlayerRef.current.src) return;
    
    // Stop all other audio
    stopAllAudio();
    
    if (isPlayingGenerated) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsPlayingGenerated(false);
    } else {
      audioPlayerRef.current.play()
        .then(() => setIsPlayingGenerated(true))
        .catch(error => {
          console.error('Error playing audio:', error);
          setError('Unable to play audio. Please try again.');
        });
    }
  };

  // Download generated audio
  const downloadAudio = () => {
    if (!generatedAudio) return;
    
    const a = document.createElement('a');
    a.href = generatedAudio;
    a.download = `${clonedVoiceId ? voiceName : selectedPredefinedVoice.name}-sample.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Reset all state
  const resetForm = () => {
    // Stop all audio
    stopAllAudio();
    
    // Clean up blob URLs to prevent memory leaks
    if (audioBlobUrl) {
      URL.revokeObjectURL(audioBlobUrl);
    }
    if (audioFileUrl) {
      URL.revokeObjectURL(audioFileUrl);
    }
    
    // Reset voice cloning state
    setVoiceName('');
    setAudioFile(null);
    setAudioFileUrl(null);
    setAudioBlob(null);
    setAudioBlobUrl(null);
    setClonedVoiceId(null);
    
    // Reset predefined voice state
    setSelectedPredefinedVoice(null);
    
    // Reset text generation state
    setSampleText("Welcome to AudiobookSmith! I'm excited to help bring your stories to life with professional-quality narration that sounds natural and engaging.");
    setGeneratedAudio(null);
    
    // Reset UI state
    setError(null);
    setSuccess(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Change tab
  const changeTab = (tab) => {
    // Reset form when changing tabs
    resetForm();
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-lg overflow-hidden">
                  <span className="text-white font-bold">AS</span>
                </div>
                <span className="text-xl font-bold">
                  <span className="text-primary-600">Audio</span>
                  <span className="text-secondary-600">book</span>
                  <span className="text-primary-600">Smith</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-800 flex items-center">
                <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-1" />
                <span>Back to Home</span>
              </Link>
              
              {currentUser ? (
                <div className="flex items-center space-x-1 px-3 py-2 bg-primary-50 text-primary-700 rounded-full text-sm">
                  <SafeIcon icon={FiUser} className="w-4 h-4" />
                  <span>{currentUser.email}</span>
                </div>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  Log In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Voice Cloning Studio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create a digital clone of your voice or choose from our library of professional voices for your audiobook project
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg border">
            <button 
              onClick={() => changeTab('clone')} 
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'clone' 
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Clone Your Voice
            </button>
            <button 
              onClick={() => changeTab('predefined')} 
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'predefined' 
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Professional Voices
            </button>
          </div>
        </div>

        {/* Status messages */}
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

        {/* Main content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left panel: Voice selection/cloning */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Voice cloning interface */}
            {activeTab === 'clone' ? (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Clone Your Voice</h2>
                  <p className="text-gray-600">
                    Record or upload a sample of your voice to create a digital clone
                  </p>
                  <button 
                    onClick={() => setShowInstructions(true)}
                    className="mt-2 text-primary-600 hover:text-primary-800 text-sm flex items-center mx-auto"
                  >
                    <SafeIcon icon={FiInfo} className="w-4 h-4 mr-1" />
                    View recording tips
                  </button>
                </div>

                {/* Voice name input */}
                <div className="mb-6">
                  <label htmlFor="voice-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Name *
                  </label>
                  <input
                    id="voice-name"
                    type="text"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    placeholder="Enter a name for your voice (e.g., 'My Narrator Voice')"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">{voiceName.length}/50 characters</p>
                </div>

                {/* Recording interface */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Record Your Voice</h3>
                  
                  {isRecording ? (
                    <div className="bg-primary-50 p-6 rounded-lg border border-primary-200">
                      <h4 className="text-lg font-semibold text-primary-900 mb-4">
                        Please read the following text clearly:
                      </h4>
                      <p className="text-primary-700 leading-relaxed text-sm mb-6 bg-white p-4 rounded-lg border border-primary-100">
                        {permissionText}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="animate-pulse w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-red-500 font-medium">
                            Recording: {recordingTime}s / {MAX_RECORDING_TIME}s
                          </span>
                        </div>
                        <button 
                          onClick={stopRecording}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4 mr-2" />
                          Stop Recording
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <button 
                        onClick={startRecording}
                        disabled={isProcessingClone}
                        className="w-24 h-24 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors mb-4"
                      >
                        <SafeIcon icon={FiMic} className="w-12 h-12 text-white" />
                      </button>
                      <p className="text-gray-600 text-center">
                        {audioBlob 
                          ? `Recording complete (${recordingTime}s)` 
                          : `Click to start recording (${MIN_RECORDING_TIME}-${MAX_RECORDING_TIME}s)`}
                      </p>
                      
                      {recordingTime > 0 && recordingTime < MIN_RECORDING_TIME && (
                        <p className="text-yellow-600 text-sm mt-1">
                          Recording too short! Please record at least {MIN_RECORDING_TIME} seconds.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Recording playback (if available) */}
                {audioBlobUrl && !isRecording && (
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={playRecording}
                          className="w-10 h-10 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white mr-3"
                        >
                          <SafeIcon icon={isPlayingRecording ? FiPause : FiPlay} className="w-5 h-5" />
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Your Recording</div>
                          <div className="text-xs text-gray-500">{recordingTime} seconds</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Audio waveform when playing */}
                    {isPlayingRecording && (
                      <div className="mt-3 flex items-center justify-center space-x-1">
                        {[...Array(16)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-primary-400 rounded-full"
                            animate={{
                              height: [4, 16, 8, 20, 6, 18, 4],
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* File upload */}
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
                        disabled={isProcessingClone}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Choose Audio File
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        MP3, WAV (max {MAX_AUDIO_SIZE / 1024 / 1024}MB, {MIN_RECORDING_TIME}-{MAX_RECORDING_TIME}s recommended)
                      </p>
                    </div>
                    
                    {audioFile && !audioBlob && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-800">
                          ✓ File: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* File playback (if available) */}
                {audioFileUrl && !audioBlobUrl && (
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={playUploadedFile}
                          className="w-10 h-10 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white mr-3"
                        >
                          <SafeIcon icon={isPlayingUploadedFile ? FiPause : FiPlay} className="w-5 h-5" />
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Uploaded File</div>
                          <div className="text-xs text-gray-500">{audioFile ? audioFile.name : ''}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Audio waveform when playing */}
                    {isPlayingUploadedFile && (
                      <div className="mt-3 flex items-center justify-center space-x-1">
                        {[...Array(16)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-primary-400 rounded-full"
                            animate={{
                              height: [4, 16, 8, 20, 6, 18, 4],
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Clone button */}
                <button 
                  onClick={cloneVoice}
                  disabled={isProcessingClone || (!audioFile && !audioBlob) || !voiceName.trim()}
                  className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                  {isProcessingClone ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                      Cloning Voice...
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiMic} className="w-6 h-6 mr-3" />
                      Clone My Voice
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Predefined voices interface */
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Voices</h2>
                  <p className="text-gray-600">
                    Choose from our library of high-quality AI voices
                  </p>
                </div>

                {/* Voice list */}
                {loadingVoices ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mr-3" />
                    <span className="text-gray-600">Loading voices...</span>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {availablePredefinedVoices.map((voice) => (
                      <div
                        key={voice.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPredefinedVoice?.id === voice.id
                            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => selectPredefinedVoice(voice)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{voice.name}</h4>
                            <p className="text-sm text-gray-600">
                              {voice.gender} • {voice.accent}
                            </p>
                          </div>
                          <button 
                            onClick={(e) => previewVoice(voice, e)}
                            className="ml-2 p-2 text-primary-500 hover:bg-primary-100 rounded-full transition-colors"
                            title={currentPreviewingVoice === voice.id ? "Stop preview" : "Play preview"}
                          >
                            <SafeIcon 
                              icon={currentPreviewingVoice === voice.id ? FiPause : FiPlay} 
                              className="w-5 h-5" 
                            />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-2">{voice.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {voice.use_cases?.slice(0, 3).map((useCase, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full"
                            >
                              {useCase}
                            </span>
                          ))}
                          
                          {voice.personality?.slice(0, 2).map((trait, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-2 py-1 bg-secondary-50 text-secondary-600 rounded-full"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                        
                        {selectedPredefinedVoice?.id === voice.id && (
                          <div className="mt-3 p-2 bg-primary-100 rounded text-sm text-primary-700">
                            ✓ Selected for speech generation
                          </div>
                        )}
                        
                        {currentPreviewingVoice === voice.id && (
                          <div className="mt-3 flex items-center justify-center space-x-1">
                            {[...Array(12)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1 bg-primary-400 rounded-full"
                                animate={{
                                  height: [4, 16, 8, 20, 6, 18, 4],
                                }}
                                transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {availablePredefinedVoices.length === 0 && !loadingVoices && (
                  <div className="text-center py-12">
                    <SafeIcon icon={FiAlertTriangle} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No professional voices available at the moment.</p>
                    <button 
                      onClick={loadPredefinedVoices}
                      className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2 inline" />
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel: Text generation */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Speech</h2>
              <p className="text-gray-600">
                Enter text to generate speech with your selected voice
              </p>
            </div>

            {/* Voice status */}
            {(clonedVoiceId || selectedPredefinedVoice) ? (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-green-700 font-medium">
                      {clonedVoiceId ? 'Your Voice is Ready!' : 'Professional Voice Selected!'}
                    </div>
                    <div className="text-green-600 text-sm">
                      {clonedVoiceId 
                        ? `"${voiceName}" is ready for speech generation` 
                        : `"${selectedPredefinedVoice.name}" is ready for speech generation`}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-blue-700">
                    Please {activeTab === 'clone' ? 'clone your voice' : 'select a professional voice'} first to generate speech.
                  </div>
                </div>
              </div>
            )}

            {/* Text input */}
            <div className="mb-6">
              <label htmlFor="sample-text" className="block text-sm font-medium text-gray-700 mb-2">
                Text to Generate *
              </label>
              <textarea
                id="sample-text"
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                placeholder="Enter the text you want to convert to speech..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                maxLength={2000}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{sampleText.length}/2000 characters</span>
                <span>{sampleText.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>

            {/* Generate button */}
            <button 
              onClick={generateSpeech}
              disabled={isGenerating || (!clonedVoiceId && !selectedPredefinedVoice) || !sampleText.trim()}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg mb-6"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                  Generating Speech...
                </>
              ) : (
                <>
                  <SafeIcon icon={FiPlay} className="w-6 h-6 mr-3" />
                  Generate Speech
                </>
              )}
            </button>

            {/* Audio player */}
            {generatedAudio && (
              <motion.div 
                className="p-6 bg-gray-50 rounded-lg border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Generated Speech</h3>
                  <button 
                    onClick={downloadAudio}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                    title="Download audio"
                  >
                    <SafeIcon icon={FiDownload} className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={togglePlay}
                    className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                  >
                    <SafeIcon icon={isPlayingGenerated ? FiPause : FiPlay} className="w-7 h-7" />
                  </button>
                  
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {clonedVoiceId 
                        ? `${voiceName} (Your Voice)` 
                        : `${selectedPredefinedVoice?.name} (Professional Voice)`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString()} • {sampleText.split(/\s+/).filter(Boolean).length} words
                    </div>
                  </div>
                  
                  {/* Audio waveform animation */}
                  {isPlayingGenerated && (
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
              </motion.div>
            )}
            
            {/* Reset button */}
            <div className="mt-6 text-center">
              <button 
                onClick={resetForm}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4 inline mr-1" />
                Reset Form
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recording instructions modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Voice Recording Tips</h3>
              <button 
                onClick={() => setShowInstructions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">For Best Results:</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Use a quiet environment with minimal background noise</li>
                  <li>• Speak clearly at a consistent pace and volume</li>
                  <li>• Position yourself 6-8 inches from the microphone</li>
                  <li>• Record at least {MIN_RECORDING_TIME} seconds of speech</li>
                  <li>• Read the entire permission text for best results</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What to Read:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-primary-500">
                  {permissionText}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full mt-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVoiceCloning;