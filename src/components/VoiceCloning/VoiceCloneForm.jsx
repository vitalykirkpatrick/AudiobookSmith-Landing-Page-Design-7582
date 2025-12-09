import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import VoiceRecorder from '../VoiceRecorder';

const {
  FiMic,
  FiUpload,
  FiPlay,
  FiPause,
  FiX,
  FiCheck,
  FiLoader,
  FiAlertTriangle,
  FiInfo,
  FiRefreshCw
} = FiIcons;

const VoiceCloneForm = () => {
  // Form state
  const [activeTab, setActiveTab] = useState('clone'); // 'clone' or 'predefined'
  const [voiceName, setVoiceName] = useState('');
  const [clonedVoiceId, setClonedVoiceId] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Text generation state
  const [sampleText, setSampleText] = useState(
    "Welcome to AudiobookSmith! I'm excited to help bring your stories to life with professional-quality narration."
  );
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Predefined voice state
  const [selectedPredefinedVoice, setSelectedPredefinedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [playingPreview, setPlayingPreview] = useState(null);

  // Refs
  const audioRef = useRef(new Audio());
  const fileInputRef = useRef(null);
  const previewAudioRef = useRef(new Audio());

  // Fetch available voices on component mount
  useEffect(() => {
    if (activeTab === 'predefined') {
      loadVoices();
    }
  }, [activeTab]);

  const loadVoices = async () => {
    setLoadingVoices(true);
    setError(null);
    
    try {
      // Mock professional voices for demo
      const mockVoices = [
        {
          voice_id: 'professional-sarah',
          name: 'Sarah (Professional)',
          gender: 'Female',
          language: 'en-US',
          description: 'Warm, professional female voice perfect for business and educational content',
          preview_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          accent: 'American',
          use_cases: ['Business', 'Educational', 'Professional']
        },
        {
          voice_id: 'professional-james',
          name: 'James (Professional)',
          gender: 'Male',
          language: 'en-US',
          description: 'Authoritative male voice ideal for narration and documentary content',
          preview_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          accent: 'American',
          use_cases: ['Narration', 'Documentary', 'News']
        },
        {
          voice_id: 'professional-emma',
          name: 'Emma (Professional)',
          gender: 'Female',
          language: 'en-GB',
          description: 'Clear British accent perfect for fiction and storytelling',
          preview_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          accent: 'British',
          use_cases: ['Fiction', 'Storytelling', 'Literature']
        }
      ];
      
      setAvailableVoices(mockVoices);
    } catch (error) {
      console.error('Error loading voices:', error);
      setError('Failed to load available voices. Please try again.');
    } finally {
      setLoadingVoices(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Basic validation
      const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/x-wav'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload MP3 or WAV files only.');
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB.');
      }

      setAudioFile(file);
      setError(null);
      setSuccess(`File "${file.name}" uploaded successfully!`);
    } catch (error) {
      setError(error.message);
      setAudioFile(null);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCloneVoice = async () => {
    try {
      if (!voiceName.trim()) {
        setError('Please enter a voice name.');
        return;
      }
      
      if (!audioFile) {
        setError('Please record or upload an audio file first.');
        return;
      }
      
      setIsProcessing(true);
      setError(null);
      setSuccess(null);
      
      // Simulate voice cloning process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockVoiceId = `cloned-voice-${Date.now()}`;
      setClonedVoiceId(mockVoiceId);
      setSuccess(`Voice "${voiceName.trim()}" cloned successfully!`);
      setSampleText('Hello! This is a test of my cloned voice. How does it sound?');
    } catch (error) {
      console.error('Voice cloning error:', error);
      setError(error.message || 'An error occurred during voice cloning.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSample = async () => {
    try {
      if (!clonedVoiceId && !selectedPredefinedVoice) {
        setError('Please clone your voice or select a professional voice first.');
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
      
      setIsGenerating(true);
      setError(null);
      setSuccess(null);
      
      // Simulate sample generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use a mock audio URL for demo
      const mockAudioUrl = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
      setGeneratedAudio(mockAudioUrl);
      setSuccess('Speech sample generated successfully!');
    } catch (error) {
      console.error('Sample generation error:', error);
      setError(error.message || 'An error occurred during sample generation.');
    } finally {
      setIsGenerating(false);
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

  const selectPredefinedVoice = (voice) => {
    setSelectedPredefinedVoice(voice);
    setClonedVoiceId(null); // Clear cloned voice when selecting professional
    setVoiceName(voice.name);
    setSuccess(`Selected professional voice: ${voice.name}`);
    setSampleText('Hello! This is a test using a professional voice. How does it sound?');
  };

  const playPreviewVoice = async (voiceId, previewUrl) => {
    try {
      if (playingPreview === voiceId) {
        previewAudioRef.current.pause();
        previewAudioRef.current.currentTime = 0;
        setPlayingPreview(null);
      } else {
        if (playingPreview) {
          previewAudioRef.current.pause();
          previewAudioRef.current.currentTime = 0;
        }
        
        previewAudioRef.current.src = previewUrl;
        await previewAudioRef.current.play();
        setPlayingPreview(voiceId);
      }
    } catch (error) {
      console.error('Error playing preview:', error);
      setError('Unable to play voice preview.');
    }
  };

  // Recording completion handler
  const handleRecordingComplete = (blob) => {
    const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
    setAudioFile(file);
    setSuccess('Recording completed successfully!');
  };

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    const previewAudio = previewAudioRef.current;
    
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setIsPlaying(false);
      setError('Error playing audio sample.');
    };
    
    const handlePreviewEnded = () => setPlayingPreview(null);
    const handlePreviewError = () => {
      setPlayingPreview(null);
      console.error('Error playing preview audio');
    };
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    previewAudio.addEventListener('ended', handlePreviewEnded);
    previewAudio.addEventListener('error', handlePreviewError);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      
      previewAudio.removeEventListener('ended', handlePreviewEnded);
      previewAudio.removeEventListener('error', handlePreviewError);
      previewAudio.pause();
    };
  }, []);

  // Update audio source when generated audio changes
  useEffect(() => {
    if (generatedAudio && audioRef.current) {
      audioRef.current.src = generatedAudio;
    }
  }, [generatedAudio]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Voice Cloning Studio</h2>
          <p className="text-lg text-gray-600">
            Create your own AI voice or choose from our professional voice library
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg border">
            <button
              onClick={() => setActiveTab('clone')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'clone'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Clone Your Voice
            </button>
            <button
              onClick={() => setActiveTab('predefined')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'predefined'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Professional Voices
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {activeTab === 'clone' ? (
              /* Voice Cloning Interface */
              <>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Clone Your Voice</h3>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">{voiceName.length}/50 characters</p>
                </div>

                {/* Voice Recording */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Record Your Voice</h3>
                  <VoiceRecorder
                    onRecordingComplete={handleRecordingComplete}
                    onRecordingDelete={() => setAudioFile(null)}
                    permissionText="I, [Your Name], hereby grant AudiobookSmith permission to use this voice recording to create an AI voice model for generating audio content based on my manuscript. I understand that this voice sample will be used solely for creating my audiobook and will not be shared with third parties."
                    isDisabled={isProcessing}
                  />
                </div>

                {/* File Upload */}
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
                        MP3, WAV (max 10MB, 10-30s recommended)
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
                  onClick={handleCloneVoice}
                  disabled={isProcessing || (!audioFile) || !voiceName.trim()}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                  {isProcessing ? (
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
              </>
            ) : (
              /* Professional Voices Interface */
              <>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Voices</h3>
                  <p className="text-gray-600">
                    Choose from our library of high-quality AI voices
                  </p>
                </div>

                {loadingVoices ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3" />
                    <span className="text-gray-600">Loading voices...</span>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {availableVoices.map((voice) => (
                      <div
                        key={voice.voice_id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPredefinedVoice?.voice_id === voice.voice_id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => selectPredefinedVoice(voice)}
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
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                                >
                                  {useCase}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playPreviewVoice(voice.voice_id, voice.preview_url);
                            }}
                            className="ml-4 p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                            title="Play preview"
                          >
                            <SafeIcon
                              icon={playingPreview === voice.voice_id ? FiPause : FiPlay}
                              className="w-5 h-5"
                            />
                          </button>
                        </div>
                        {selectedPredefinedVoice?.voice_id === voice.voice_id && (
                          <div className="mt-3 p-2 bg-blue-100 rounded text-sm text-blue-700">
                            ✓ Selected for speech generation
                          </div>
                        )}
                        {playingPreview === voice.voice_id && (
                          <div className="mt-3 flex items-center justify-center space-x-1">
                            {[...Array(12)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1 bg-blue-400 rounded-full"
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

                {availableVoices.length === 0 && !loadingVoices && (
                  <div className="text-center py-12">
                    <SafeIcon icon={FiMic} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No professional voices available at the moment.</p>
                    <button
                      onClick={loadVoices}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2 inline" />
                      Retry
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Test Your Voice</h3>
              <p className="text-gray-600">
                Generate a speech sample to hear the results
              </p>
            </div>

            {/* Voice Status */}
            {(clonedVoiceId || selectedPredefinedVoice) && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-green-700 font-medium">
                      {clonedVoiceId ? 'Voice Cloned!' : 'Voice Selected!'}
                    </div>
                    <div className="text-green-600 text-sm">
                      {clonedVoiceId
                        ? `"${voiceName}" is ready for speech generation`
                        : `"${selectedPredefinedVoice.name}" is ready for speech generation`}
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
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{sampleText.length}/1000 characters</span>
                <span>{sampleText.split(' ').filter(word => word.length > 0).length} words</span>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateSample}
                disabled={isGenerating || (!clonedVoiceId && !selectedPredefinedVoice) || !sampleText.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
              >
                {isGenerating ? (
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
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={playGeneratedSample}
                      className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                    >
                      <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Voice Sample</div>
                      <div className="text-xs text-gray-500">
                        {clonedVoiceId
                          ? `${voiceName} (Cloned Voice)`
                          : `${selectedPredefinedVoice?.name} (Professional Voice)`}
                      </div>
                    </div>
                    {/* Audio Waveform when playing */}
                    {isPlaying && (
                      <div className="flex items-center space-x-1">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-blue-400 rounded-full"
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

              {/* Help Text */}
              {!clonedVoiceId && !selectedPredefinedVoice && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    💡 Clone your voice or select a professional voice first to generate speech samples.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCloneForm;