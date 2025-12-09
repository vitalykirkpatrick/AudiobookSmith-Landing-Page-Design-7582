import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMic, FiUpload, FiPlay, FiPause, FiX, FiCheck, FiClock, FiStar, FiShield, FiZap, FiAlertTriangle, FiLoader } = FiIcons;

const VoiceCloning = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sampleText, setSampleText] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceName, setVoiceName] = useState('');
  const [clonedVoiceId, setClonedVoiceId] = useState(null);
  const [error, setError] = useState(null);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showVoiceSelection, setShowVoiceSelection] = useState(false);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioRef = useRef(null);
  const maxRecordingTime = 30; // seconds

  // Fetch available voices on component mount
  useEffect(() => {
    fetchAvailableVoices();
  }, []);

  const fetchAvailableVoices = async () => {
    try {
      const response = await fetch('/api/available-voices');
      const data = await response.json();
      
      if (data.success) {
        setAvailableVoices(data.voices);
      } else {
        console.error('Failed to fetch available voices:', data.message);
      }
    } catch (error) {
      console.error('Error fetching available voices:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Clear previous chunks
      audioChunks.current = [];
      
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start(100); // Record in 100ms chunks
      setIsRecording(true);
      setRecordingTime(0);
      setError(null);

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
    if (file) {
      // Validate file type
      const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/x-wav'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload MP3 or WAV files only.');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('File size must be less than 10MB.');
        return;
      }

      setAudioFile(file);
      setAudioBlob(null);
      setError(null);
    }
  };

  const cloneVoice = async () => {
    if (!audioBlob && !audioFile) {
      setError('Please record or upload an audio file first.');
      return;
    }

    if (!voiceName.trim()) {
      setError('Please enter a name for your voice.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Use uploaded file or recorded blob
      if (audioFile) {
        formData.append('audio_file', audioFile);
      } else if (audioBlob) {
        // Convert webm to wav for better compatibility
        const wavBlob = await convertToWav(audioBlob);
        formData.append('audio_file', wavBlob, 'recording.wav');
      }
      
      formData.append('voice_name', voiceName.trim());

      const response = await fetch('/api/clone-voice', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setClonedVoiceId(data.voice_id);
        setError(null);
        
        // Set default sample text
        setSampleText('Hello! This is a test of my cloned voice. How does it sound?');
      } else {
        setError(data.message || 'Failed to clone voice. Please try again.');
      }
    } catch (error) {
      console.error('Voice cloning error:', error);
      setError('An error occurred during voice cloning. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSample = async () => {
    if (!clonedVoiceId) {
      setError('Please clone your voice first.');
      return;
    }

    if (!sampleText.trim()) {
      setError('Please enter some text to generate speech.');
      return;
    }

    if (sampleText.length > 1000) {
      setError('Text must be 1000 characters or less.');
      return;
    }

    setIsGeneratingSample(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voice_id: clonedVoiceId,
          text: sampleText.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedAudio(data.audio_url);
        setError(null);
      } else {
        setError(data.message || 'Failed to generate speech sample. Please try again.');
      }
    } catch (error) {
      console.error('Sample generation error:', error);
      setError('An error occurred during sample generation. Please try again.');
    } finally {
      setIsGeneratingSample(false);
    }
  };

  const convertToWav = async (webmBlob) => {
    return new Promise((resolve) => {
      // For now, return the blob as-is since the backend can handle webm
      // In a production environment, you might want to convert to WAV format
      resolve(new Blob([webmBlob], { type: 'audio/wav' }));
    });
  };

  const playGeneratedSample = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const playPreviewVoice = async (voiceUrl) => {
    try {
      const audio = new Audio(voiceUrl);
      audio.play();
    } catch (error) {
      console.error('Error playing preview:', error);
    }
  };

  const selectVoice = (voice) => {
    setSelectedVoice(voice);
    setClonedVoiceId(voice.voice_id);
    setVoiceName(voice.name);
    setShowVoiceSelection(false);
    setSampleText('Hello! This is a test using a professional voice. How does it sound?');
  };

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        setError('Error playing audio sample.');
      };
    }
  }, [generatedAudio]);

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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Advanced Voice Cloning
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Create a digital twin of your voice with our cutting-edge AI technology. Perfect for authors who want to narrate their own audiobooks with professional quality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Error Display */}
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

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Voice Selection/Cloning Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Voice</h2>
                <p className="text-gray-600">
                  Choose to clone your own voice or select from our professional voice library
                </p>
              </div>

              {/* Options */}
              <div className="space-y-6">
                
                {/* Professional Voices Option */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Professional Voices</h3>
                    <button
                      onClick={() => setShowVoiceSelection(!showVoiceSelection)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {showVoiceSelection ? 'Hide Voices' : 'Browse Voices'}
                    </button>
                  </div>
                  
                  {showVoiceSelection && (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {availableVoices.map((voice) => (
                        <div
                          key={voice.voice_id}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            selectedVoice?.voice_id === voice.voice_id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => selectVoice(voice)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{voice.name}</h4>
                              <p className="text-sm text-gray-600">{voice.gender} • {voice.language}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {voice.use_cases.map((useCase, idx) => (
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
                                className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
                              >
                                <SafeIcon icon={FiPlay} className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice Cloning Option */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Clone Your Voice</h3>
                  
                  {/* Voice Name Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voice Name
                    </label>
                    <input
                      type="text"
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      placeholder="Enter a name for your voice (e.g., 'My Voice')"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Recording Interface */}
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
                            strokeWidth="8"
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
                        ? 'Recording in progress...' 
                        : audioBlob 
                          ? 'Click to record again' 
                          : 'Record at least 10 seconds of clear speech'}
                    </p>
                  </div>

                  {/* File Upload Alternative */}
                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or Upload Audio File
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: MP3, WAV (max 10MB, 30 seconds recommended)
                    </p>
                  </div>

                  {/* Clone Button */}
                  <button
                    onClick={cloneVoice}
                    disabled={isProcessing || (!audioBlob && !audioFile) || !voiceName.trim()}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Cloning Voice...
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiZap} className="w-5 h-5 mr-2" />
                        Clone My Voice
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Generation Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Your Voice</h2>
                <p className="text-gray-600">
                  Generate a speech sample to hear how your voice sounds
                </p>
              </div>

              {/* Success Message */}
              {clonedVoiceId && !isProcessing && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                  <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-green-700 font-medium">Voice Ready!</div>
                    <div className="text-green-600 text-sm">
                      {selectedVoice ? `Selected "${selectedVoice.name}"` : `"${voiceName}" has been cloned successfully`}
                    </div>
                  </div>
                </div>
              )}

              {/* Sample Text Input */}
              <div className="space-y-4">
                <textarea
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  placeholder="Enter text to generate speech sample (max 1000 characters)..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500">
                  {sampleText.length}/1000 characters
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateSample}
                  disabled={isGeneratingSample || !clonedVoiceId || !sampleText.trim()}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGeneratingSample ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiPlay} className="w-5 h-5 mr-2" />
                      Generate Sample
                    </>
                  )}
                </button>

                {/* Generated Sample Player */}
                {generatedAudio && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Your Voice Sample</h4>
                      <span className="text-sm text-gray-500">Generated</span>
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
                          {selectedVoice ? `${selectedVoice.name} Voice` : `${voiceName} (Cloned)`}
                        </div>
                      </div>
                      
                      {/* Audio Waveform when playing */}
                      {isPlaying && (
                        <div className="flex items-center space-x-1">
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-primary-400 rounded-full"
                              animate={{
                                height: [4, 12, 6, 16, 8, 14, 4],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.1,
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
              Use your cloned voice or selected professional voice to create a full audiobook
            </p>
            <Link
              to="/#pricing"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
            >
              <SafeIcon icon={FiZap} className="w-5 h-5 mr-2" />
              Choose Your Plan
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-primary-500" />
              </div>
              <h4 className="font-semibold text-gray-900">Secure Processing</h4>
              <p className="text-sm text-gray-500">Your voice data is encrypted and protected</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <SafeIcon icon={FiZap} className="w-6 h-6 text-primary-500" />
              </div>
              <h4 className="font-semibold text-gray-900">Fast Results</h4>
              <p className="text-sm text-gray-500">Voice cloning completed in minutes</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <SafeIcon icon={FiStar} className="w-6 h-6 text-primary-500" />
              </div>
              <h4 className="font-semibold text-gray-900">Studio Quality</h4>
              <p className="text-sm text-gray-500">Professional-grade voice synthesis</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VoiceCloning;