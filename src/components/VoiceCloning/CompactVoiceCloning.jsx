import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';
import { elevenlabsVoices } from '../../utils/elevenlabsVoices';

const { FiMic, FiUpload, FiPlay, FiPause, FiX, FiCheck, FiLoader, FiAlertTriangle, FiInfo, FiDownload, FiRefreshCw, FiArrowLeft, FiUser, FiSettings, FiVolume2 } = FiIcons;

const CompactVoiceCloning = () => {
  // User state
  const [user, setUser] = useState(null);

  // Form state
  const [voiceName, setVoiceName] = useState('');
  const [inputMethod, setInputMethod] = useState('none'); // 'none', 'record', 'upload'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clonedVoiceId, setClonedVoiceId] = useState(null);

  // Voice selection state
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // UI state
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPermissionText, setShowPermissionText] = useState(false);
  const [showMicrophoneHelp, setShowMicrophoneHelp] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState('unknown'); // 'granted', 'denied', 'unknown'
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [isPlayingFile, setIsPlayingFile] = useState(false);

  // Text generation state
  const [sampleText, setSampleText] = useState(
    "Welcome to AudiobookSmith! I'm excited to help bring your stories to life with professional-quality narration that sounds natural and engaging."
  );
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingGenerated, setIsPlayingGenerated] = useState(false);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const recordingPlayerRef = useRef(new Audio());
  const uploadedFilePlayerRef = useRef(new Audio());
  const generatedAudioRef = useRef(new Audio());
  const previewAudioRef = useRef(new Audio());
  const voicePreviewRefs = useRef({});
  const mediaStreamRef = useRef(null);

  // Constants
  const MAX_RECORDING_TIME = 60; // seconds - increased from 30
  const MIN_RECORDING_TIME = 5; // seconds - reduced from 20 to make testing easier
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_b006ebce7fa44b04bdc0037b5858fbdaa62e85688177a5b4';

  // Permission text that users must read
  const permissionText = `I, ${voiceName || '[Your Name]'}, hereby grant AudiobookSmith permission to use this voice recording to create an AI voice model for generating audio content based on my manuscript. I understand that this voice sample will be used solely for creating my audiobook and will not be shared with third parties or used for any other commercial purposes without my explicit consent. I confirm that I am the rightful owner of this voice recording and have the authority to grant this permission.`;

  // Check microphone permission on mount
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'microphone' });
        setMicrophonePermission(permission.state);
        permission.onchange = () => {
          setMicrophonePermission(permission.state);
        };
      } catch (error) {
        console.log('Permission API not supported');
      }
    };
    checkMicrophonePermission();

    // Cleanup function for any active media streams
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    checkUser();
  }, []);

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
    return () => clearInterval(interval);
  }, [isRecording]);

  // Initialize voice preview refs
  useEffect(() => {
    elevenlabsVoices.forEach(voice => {
      if (!voicePreviewRefs.current[voice.id]) {
        voicePreviewRefs.current[voice.id] = new Audio();
      }
    });
  }, []);

  // Audio player event handlers
  useEffect(() => {
    const recordingPlayer = recordingPlayerRef.current;
    const uploadedFilePlayer = uploadedFilePlayerRef.current;
    const generatedAudioPlayer = generatedAudioRef.current;
    const previewAudio = previewAudioRef.current;

    // Recording player event handlers
    recordingPlayer.onended = () => setIsPlayingRecording(false);
    recordingPlayer.onerror = () => {
      console.error('Error playing recording');
      setIsPlayingRecording(false);
    };

    // Uploaded file player event handlers
    uploadedFilePlayer.onended = () => setIsPlayingFile(false);
    uploadedFilePlayer.onerror = () => {
      console.error('Error playing uploaded file');
      setIsPlayingFile(false);
    };

    // Generated audio player event handlers
    generatedAudioPlayer.onended = () => setIsPlayingGenerated(false);
    generatedAudioPlayer.onerror = () => {
      console.error('Error playing generated audio');
      setIsPlayingGenerated(false);
    };

    // Preview audio event handlers
    previewAudio.onended = () => setIsPlayingPreview(false);
    previewAudio.onerror = () => {
      console.error('Error playing preview audio');
      setIsPlayingPreview(false);
    };

    // Voice preview event handlers
    Object.values(voicePreviewRefs.current).forEach((audio, index) => {
      const voiceId = elevenlabsVoices[index]?.id;
      if (audio && voiceId) {
        audio.onended = () => setPlayingVoiceId(null);
        audio.onerror = () => {
          console.error('Error playing voice preview');
          setPlayingVoiceId(null);
        };
      }
    });

    return () => {
      // Clean up all audio players
      if (recordingPlayer) {
        recordingPlayer.pause();
        recordingPlayer.src = '';
      }
      if (uploadedFilePlayer) {
        uploadedFilePlayer.pause();
        uploadedFilePlayer.src = '';
      }
      if (generatedAudioPlayer) {
        generatedAudioPlayer.pause();
        generatedAudioPlayer.src = '';
      }
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.src = '';
      }
      Object.values(voicePreviewRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  // Clear all previous data completely
  const clearAllData = () => {
    // Stop all audio
    stopAllAudio();

    // Clean up blob URLs to prevent memory leaks
    if (recordingPlayerRef.current.src && recordingPlayerRef.current.src.startsWith('blob:')) {
      URL.revokeObjectURL(recordingPlayerRef.current.src);
    }
    if (uploadedFilePlayerRef.current.src && uploadedFilePlayerRef.current.src.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedFilePlayerRef.current.src);
    }

    // Clear audio data
    setAudioBlob(null);
    setAudioFile(null);
    
    // Keep voice selection if clearing for new recording
    // Only clear voice selection if explicitly requested

    // Clear UI states
    setError(null);
    setShowPermissionText(false);
    setRecordingTime(0);

    // Clear audio players
    recordingPlayerRef.current.src = '';
    uploadedFilePlayerRef.current.src = '';

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Start recording function
  const startRecording = async () => {
    try {
      // Validate voice name
      if (!voiceName.trim()) {
        setError('Please enter a name for your voice first.');
        return;
      }

      // Clear previous recording data but keep other settings
      if (audioBlob || audioFile) {
        clearAllData();
      }

      setError(null);
      setInputMethod('record');
      setShowPermissionText(true);

      // Reset audio chunks
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

      // Store the stream reference for cleanup
      mediaStreamRef.current = stream;
      setMicrophonePermission('granted');

      // Create media recorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });

      // Set up data available handler
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Set up stop handler
      mediaRecorderRef.current.onstop = () => {
        // Create audio blob
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        
        // Validate recording length
        if (recordingTime < MIN_RECORDING_TIME) {
          setError(`Recording must be at least ${MIN_RECORDING_TIME} seconds long. Please try again.`);
          // Stop all tracks
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
          }
          return;
        }

        setAudioBlob(blob);
        
        // Create URL for playback
        const blobUrl = URL.createObjectURL(blob);
        recordingPlayerRef.current.src = blobUrl;

        // Create file from blob for upload
        const file = new File(
          [blob],
          `recording-${Date.now()}.wav`,
          { type: 'audio/wav' }
        );
        setAudioFile(file);
        
        setShowPermissionText(false);
        setSuccess(`Recording completed successfully! (${recordingTime} seconds) You can now clone your voice.`);

        // Stop all tracks
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }
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

    } catch (err) {
      console.error('Error starting recording:', err);
      setMicrophonePermission('denied');
      setError('Unable to access microphone. Please check permissions.');
      setShowMicrophoneHelp(true);
      setShowPermissionText(false);
      setInputMethod('none');
    }
  };

  // Stop recording function
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
      // Validate voice name
      if (!voiceName.trim()) {
        setError('Please enter a name for your voice first.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Clear previous recording data
      clearAllData();
      
      setInputMethod('upload');

      // Validate file type
      const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/x-wav', 'audio/webm'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload MP3, WAV, or WebM files only.');
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      }

      // Set file and create URL for playback
      setAudioFile(file);
      const fileUrl = URL.createObjectURL(file);
      uploadedFilePlayerRef.current.src = fileUrl;
      
      setError(null);
      setSuccess(`File "${file.name}" uploaded successfully! Make sure your recording contains the permission text shown above.`);

    } catch (error) {
      setError(error.message);
      setAudioFile(null);
      setInputMethod('none');
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Play recording
  const playRecording = () => {
    if (!recordingPlayerRef.current.src) return;

    if (isPlayingRecording) {
      recordingPlayerRef.current.pause();
      recordingPlayerRef.current.currentTime = 0;
      setIsPlayingRecording(false);
    } else {
      // Stop other audio first
      stopAllAudio();
      recordingPlayerRef.current.play()
        .then(() => setIsPlayingRecording(true))
        .catch(error => {
          console.error('Error playing recording:', error);
          setError('Unable to play recording. Please try again.');
        });
    }
  };

  // Play uploaded file
  const playUploadedFile = () => {
    if (!uploadedFilePlayerRef.current.src) return;

    if (isPlayingFile) {
      uploadedFilePlayerRef.current.pause();
      uploadedFilePlayerRef.current.currentTime = 0;
      setIsPlayingFile(false);
    } else {
      // Stop other audio first
      stopAllAudio();
      uploadedFilePlayerRef.current.play()
        .then(() => setIsPlayingFile(true))
        .catch(error => {
          console.error('Error playing uploaded file:', error);
          setError('Unable to play uploaded file. Please try again.');
        });
    }
  };

  // Play generated audio
  const playGeneratedAudio = () => {
    if (!generatedAudioRef.current.src) return;

    if (isPlayingGenerated) {
      generatedAudioRef.current.pause();
      generatedAudioRef.current.currentTime = 0;
      setIsPlayingGenerated(false);
    } else {
      // Stop other audio first
      stopAllAudio();
      generatedAudioRef.current.play()
        .then(() => setIsPlayingGenerated(true))
        .catch(error => {
          console.error('Error playing generated audio:', error);
          setError('Unable to play generated audio. Please try again.');
        });
    }
  };

  // Play preview sample for cloned voice
  const playPreviewSample = async () => {
    if (!clonedVoiceId) return;

    try {
      if (isPlayingPreview) {
        previewAudioRef.current.pause();
        previewAudioRef.current.currentTime = 0;
        setIsPlayingPreview(false);
        return;
      }

      // Stop other audio first
      stopAllAudio();

      // For demo purposes, use a sample audio URL
      const demoAudioUrl = 'https://resource.unmixr.com/sample_audio/f45177b6-db98-479a-b8f7-57a997014d31.mp3';
      
      previewAudioRef.current.src = demoAudioUrl;
      previewAudioRef.current.play()
        .then(() => setIsPlayingPreview(true))
        .catch(error => {
          console.error('Error playing preview:', error);
          setError('Unable to play preview. Please try again.');
        });

    } catch (error) {
      console.error('Error generating preview:', error);
      setError('Unable to generate preview. Please try again.');
    }
  };

  // Play voice preview for standard voices
  const playVoicePreview = async (voice) => {
    try {
      if (playingVoiceId === voice.id) {
        const audio = voicePreviewRefs.current[voice.id];
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        setPlayingVoiceId(null);
        return;
      }

      // Stop all other audio
      stopAllAudio();

      const audio = voicePreviewRefs.current[voice.id];
      if (audio) {
        audio.src = voice.preview_url;
        audio.play()
          .then(() => setPlayingVoiceId(voice.id))
          .catch(error => {
            console.error('Error playing voice preview:', error);
            setError('Unable to play voice preview.');
          });
      }
    } catch (error) {
      console.error('Error playing voice preview:', error);
      setError('Unable to play voice preview.');
    }
  };

  // Select a standard voice
  const selectVoice = (voice) => {
    setSelectedVoice(voice);
    setClonedVoiceId(null); // Clear cloned voice when selecting standard voice
    setSuccess(`Selected voice: ${voice.name}`);
    
    // Set customized sample text for this voice
    setSampleText(`Hello, I'm ${voice.name}. ${voice.description} I would be perfect for your audiobook project.`);
  };

  // Stop all audio playback
  const stopAllAudio = () => {
    // Stop recording playback
    recordingPlayerRef.current.pause();
    recordingPlayerRef.current.currentTime = 0;
    setIsPlayingRecording(false);

    // Stop uploaded file playback
    uploadedFilePlayerRef.current.pause();
    uploadedFilePlayerRef.current.currentTime = 0;
    setIsPlayingFile(false);

    // Stop generated audio playback
    generatedAudioRef.current.pause();
    generatedAudioRef.current.currentTime = 0;
    setIsPlayingGenerated(false);

    // Stop preview audio
    previewAudioRef.current.pause();
    previewAudioRef.current.currentTime = 0;
    setIsPlayingPreview(false);

    // Stop all voice previews
    Object.values(voicePreviewRefs.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setPlayingVoiceId(null);
  };

  // Clone voice using ElevenLabs API (mock implementation for demo)
  const cloneVoice = async () => {
    if (!voiceName.trim()) {
      setError('Please enter a name for your voice.');
      return;
    }
    if (!audioFile && !audioBlob) {
      setError('Please record or upload an audio file first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      // For the demo, simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a mock voice ID
      const mockVoiceId = `cloned-voice-${Date.now()}`;
      
      // Update state
      setClonedVoiceId(mockVoiceId);
      setSelectedVoice(null); // Clear selected voice when cloning
      setSuccess(`Voice "${voiceName}" has been successfully cloned! You can now preview it and generate speech.`);
      
      // Set default sample text
      setSampleText(`Hello! This is ${voiceName}, your personal AI voice clone. How do I sound to you? Feel free to type any text and I'll read it in your voice.`);

    } catch (error) {
      console.error('Error cloning voice:', error);
      setError(error.message || 'Failed to clone voice. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate speech sample (mock implementation for demo)
  const generateSpeech = async () => {
    const activeVoiceId = clonedVoiceId || selectedVoice?.id;
    
    if (!activeVoiceId) {
      setError('Please clone your voice or select a professional voice first.');
      return;
    }
    if (!sampleText.trim()) {
      setError('Please enter text to generate speech.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      // For the demo, simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Use a sample audio URL based on voice type
      let audioUrl;
      if (selectedVoice) {
        // Use the preview URL of the selected voice
        audioUrl = selectedVoice.preview_url;
      } else {
        // For cloned voice, use a demo sample
        audioUrl = 'https://resource.unmixr.com/sample_audio/e9d18dad-b28c-4cba-b479-b73c684bc5c8.mp3';
      }

      // Update state
      setGeneratedAudio(audioUrl);
      generatedAudioRef.current.src = audioUrl;
      setSuccess('Speech generated successfully!');

    } catch (error) {
      console.error('Error generating speech:', error);
      setError(error.message || 'Failed to generate speech. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset form
  const resetForm = () => {
    // Clear all data
    clearAllData();
    
    // Reset form fields
    setVoiceName('');
    setSampleText("Welcome to AudiobookSmith! I'm excited to help bring your stories to life with professional-quality narration that sounds natural and engaging.");
    setRecordingTime(0);
    setClonedVoiceId(null);
    setSelectedVoice(null);
    setGeneratedAudio(null);
    
    // Reset UI state
    setSuccess(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header - Consistent with Home Page */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-lg overflow-hidden">
                  {/* AI Chip Design - Consistent with Home Page */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center relative">
                      {/* Circuit Pattern */}
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
                      {/* Central Processing Unit */}
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
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/voice-samples" className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer">
                Voice Samples
              </Link>
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer">
                Home
              </Link>
              {user ? (
                <div className="flex items-center space-x-1 px-3 py-2 bg-primary-50 text-primary-700 rounded-full text-sm">
                  <SafeIcon icon={FiUser} className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  Log In
                </Link>
              )}
            </div>
            {/* Mobile menu */}
            <div className="md:hidden flex items-center space-x-4">
              <Link to="/voice-samples" className="text-gray-700 hover:text-primary-600 transition-colors">
                <SafeIcon icon={FiVolume2} className="w-5 h-5" />
              </Link>
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Cloning Studio</h1>
          <p className="text-gray-600">Clone your voice or choose from our professional voice library</p>
        </div>

        {/* Instruction Text */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">How It Works</h2>
          <div className="space-y-2 text-blue-800">
            <p>1. <strong>Clone Your Voice:</strong> Record or upload your voice ({MIN_RECORDING_TIME}-{MAX_RECORDING_TIME} seconds)</p>
            <p>2. <strong>OR Choose Professional Voice:</strong> Select from our curated library of audiobook voices</p>
            <p>3. <strong>Generate Speech:</strong> Type any text and hear it in your chosen voice</p>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Progress Steps */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4">
            <div className="flex justify-between">
              <div className={`flex flex-col items-center ${(audioFile || audioBlob || selectedVoice) ? 'text-white' : 'text-white'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${(audioFile || audioBlob || selectedVoice) ? 'bg-white text-primary-500' : 'bg-white/30 text-white'}`}>1</div>
                <span className="text-xs">Choose Voice</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className={`h-0.5 w-full ${(clonedVoiceId || selectedVoice) ? 'bg-white' : 'bg-white/30'}`}></div>
              </div>
              <div className={`flex flex-col items-center ${(clonedVoiceId || selectedVoice) ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${(clonedVoiceId || selectedVoice) ? 'bg-white text-primary-500' : 'bg-white/30 text-white/50'}`}>2</div>
                <span className="text-xs">Voice Ready</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className={`h-0.5 w-full ${generatedAudio ? 'bg-white' : 'bg-white/30'}`}></div>
              </div>
              <div className={`flex flex-col items-center ${generatedAudio ? 'text-white' : 'text-white/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${generatedAudio ? 'bg-white text-primary-500' : 'bg-white/30 text-white/50'}`}>3</div>
                <span className="text-xs">Generate Speech</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {/* Status messages */}
            {error && (
              <motion.div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-red-700">{error}</div>
              </motion.div>
            )}
            {success && (
              <motion.div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-green-700">{success}</div>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column: Voice Selection */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <SafeIcon icon={FiMic} className="w-5 h-5 mr-2 text-primary-500" />
                  Step 1: Choose Your Voice
                </h2>

                {/* Voice Cloning Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Clone Your Voice</h3>
                  
                  {/* Voice Name Input */}
                  <div className="mb-4">
                    <label htmlFor="voice-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Voice Name *
                    </label>
                    <input
                      id="voice-name"
                      type="text"
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      placeholder="Enter a name for your voice"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      maxLength={50}
                    />
                  </div>

                  {/* Permission Text Display - Always Show */}
                  <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="text-sm font-semibold text-yellow-900 mb-2">
                      Required Text for Recording/Upload:
                    </h4>
                    <div className="text-yellow-800 text-sm bg-white p-3 rounded border border-yellow-100 leading-relaxed">
                      {permissionText}
                    </div>
                    <p className="text-xs text-yellow-700 mt-2">
                      Your recording must contain this exact text for voice cloning to work properly.
                    </p>
                  </div>

                  {/* Recording/Upload Interface */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Recording */}
                    <div className="text-center">
                      <button
                        onClick={startRecording}
                        disabled={isProcessing || inputMethod === 'upload'}
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-colors mb-2 ${inputMethod === 'upload' ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600'}`}
                      >
                        <SafeIcon icon={FiMic} className="w-8 h-8" />
                      </button>
                      <p className="text-sm text-gray-600">Record Voice</p>
                    </div>

                    {/* Upload */}
                    <div className="text-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing || inputMethod === 'record'}
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-colors mb-2 ${inputMethod === 'record' ? 'bg-gray-300 cursor-not-allowed' : 'bg-secondary-500 hover:bg-secondary-600'}`}
                      >
                        <SafeIcon icon={FiUpload} className="w-8 h-8" />
                      </button>
                      <p className="text-sm text-gray-600">Upload File</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Recording Status */}
                  {isRecording && (
                    <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-red-500 font-medium">
                            Recording: {recordingTime}s / {MAX_RECORDING_TIME}s
                          </span>
                        </div>
                        <button
                          onClick={stopRecording}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Stop
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Audio Preview */}
                  {(audioBlob || audioFile) && !isRecording && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-green-800">
                              {inputMethod === 'record' ? 'Recording Complete' : audioFile?.name}
                            </div>
                            <div className="text-xs text-green-600">
                              {inputMethod === 'record' ? `${recordingTime} seconds` : `${(audioFile?.size / 1024 / 1024).toFixed(2)} MB`}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={inputMethod === 'record' ? playRecording : playUploadedFile}
                          className="p-2 text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors"
                        >
                          <SafeIcon icon={(inputMethod === 'record' ? isPlayingRecording : isPlayingFile) ? FiPause : FiPlay} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Clone Button */}
                  <button
                    onClick={cloneVoice}
                    disabled={isProcessing || (!audioFile && !audioBlob) || !voiceName.trim()}
                    className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Cloning Voice...
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiMic} className="w-5 h-5 mr-2" />
                        Clone My Voice
                      </>
                    )}
                  </button>

                  {/* Cloned Voice Preview */}
                  {clonedVoiceId && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Preview Your Cloned Voice</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{voiceName}</p>
                          <p className="text-xs text-gray-500">Cloned Voice</p>
                        </div>
                        <button
                          onClick={playPreviewSample}
                          className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                        >
                          <SafeIcon icon={isPlayingPreview ? FiPause : FiPlay} className="w-5 h-5" />
                        </button>
                      </div>
                      {isPlayingPreview && (
                        <div className="mt-3 flex items-center justify-center space-x-1">
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
                  )}
                </div>

                {/* Professional Voices Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Or Choose a Professional Voice
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {elevenlabsVoices.map((voice) => (
                      <div
                        key={voice.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedVoice?.id === voice.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => selectVoice(voice)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{voice.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {voice.gender} • {voice.accent}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">{voice.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {voice.use_cases.map((useCase, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {useCase}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playVoicePreview(voice);
                            }}
                            className={`ml-4 p-2 ${playingVoiceId === voice.id ? 'bg-red-500' : 'bg-primary-500'} text-white rounded-full hover:opacity-90 transition-colors`}
                          >
                            <SafeIcon icon={playingVoiceId === voice.id ? FiPause : FiPlay} className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {playingVoiceId === voice.id && (
                          <div className="mt-3 flex items-center justify-center space-x-1">
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

                        {selectedVoice?.id === voice.id && (
                          <div className="mt-3 p-2 bg-primary-100 rounded text-sm text-primary-700">
                            ✓ Selected for speech generation
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Text Generation */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <SafeIcon icon={FiPlay} className="w-5 h-5 mr-2 text-primary-500" />
                  Step 2: Generate Speech
                </h2>

                {/* Voice Status */}
                {(clonedVoiceId || selectedVoice) ? (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                      <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-green-700 font-medium">
                          {clonedVoiceId ? 'Your Voice is Ready!' : 'Professional Voice Selected!'}
                        </div>
                        <div className="text-green-600 text-sm">
                          {clonedVoiceId ? `"${voiceName}" is ready for speech generation` : `"${selectedVoice.name}" is ready for speech generation`}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div className="text-blue-700">
                        Please clone your voice or select a professional voice first to generate speech.
                      </div>
                    </div>
                  </div>
                )}

                {/* Sample Text */}
                <div className="mb-6">
                  <label htmlFor="sample-text" className="block text-sm font-medium text-gray-700 mb-2">
                    Text to Generate
                  </label>
                  <textarea
                    id="sample-text"
                    value={sampleText}
                    onChange={(e) => setSampleText(e.target.value)}
                    placeholder="Enter the text you want to convert to speech..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                    maxLength={1000}
                    disabled={!clonedVoiceId && !selectedVoice}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{sampleText.length}/1000 characters</span>
                    <span>{sampleText.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateSpeech}
                  disabled={isGenerating || (!clonedVoiceId && !selectedVoice) || !sampleText.trim()}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-6"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Speech...
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiPlay} className="w-5 h-5 mr-2" />
                      Generate Speech
                    </>
                  )}
                </button>

                {/* Generated Audio Player */}
                {generatedAudio && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900">Generated Speech</h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={playGeneratedAudio}
                        className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                      >
                        <SafeIcon icon={isPlayingGenerated ? FiPause : FiPlay} className="w-6 h-6" />
                      </button>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {clonedVoiceId ? `${voiceName} (Your Voice)` : `${selectedVoice?.name} (Professional Voice)`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date().toLocaleTimeString()} • {sampleText.split(/\s+/).filter(Boolean).length} words
                        </div>
                      </div>
                      
                      {/* Audio waveform when playing */}
                      {isPlayingGenerated && (
                        <div className="flex items-center space-x-1">
                          {[...Array(8)].map((_, i) => (
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
                  </div>
                )}

                {/* Reset Button */}
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
        </div>
      </div>

      {/* Microphone Help Modal */}
      <AnimatePresence>
        {showMicrophoneHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Enable Microphone Access</h3>
                <button
                  onClick={() => setShowMicrophoneHelp(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    Microphone access is required to record your voice for cloning.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Chrome/Edge:</h4>
                  <ol className="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
                    <li>Click the camera/microphone icon in the address bar</li>
                    <li>Select "Always allow" for microphone</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Firefox:</h4>
                  <ol className="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
                    <li>Click the microphone icon in the address bar</li>
                    <li>Select "Allow" and check "Remember this decision"</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Safari:</h4>
                  <ol className="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
                    <li>Go to Safari → Settings → Websites → Microphone</li>
                    <li>Set this website to "Allow"</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                </div>
              </div>
              <button
                onClick={() => setShowMicrophoneHelp(false)}
                className="w-full mt-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer - Consistent with Home Page */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AS</span>
              </div>
              <span className="text-lg font-bold">AudiobookSmith</span>
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

export default CompactVoiceCloning;