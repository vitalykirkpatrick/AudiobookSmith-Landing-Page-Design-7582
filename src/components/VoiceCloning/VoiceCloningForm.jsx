// Update the cloneVoice function:
const cloneVoice = async () => {
  // ... existing validation code ...

  try {
    // Create audio URL for uploaded/recorded file
    const audioUrl = audioFile 
      ? URL.createObjectURL(audioFile)
      : recordedBlob 
        ? URL.createObjectURL(recordedBlob)
        : null;

    setGeneratedAudio(audioUrl); // Store the URL to enable playback
    setSuccess(`Voice "${voiceName.trim()}" ready for preview!`);
    
    // Continue with the cloning process
    // ... rest of the cloning code ...
  } catch (error) {
    console.error('Voice cloning error:', error);
    setError('An error occurred during voice cloning. Please try again.');
  }
};

// Add function to switch tabs
const handleTabChange = (newTab) => {
  // Reset all state when switching tabs
  setVoiceType(newTab);
  setVoiceName('');
  setAudioFile(null);
  setRecordedBlob(null);
  setClonedVoiceId(null);
  setSelectedVoiceId('');
  setGeneratedAudio(null);
  setIsPlaying(false);
  setError(null);
  setSuccess(null);
  setSampleText("Welcome to AudiobookSmith! I'm excited to help bring your stories to life with professional-quality narration.");
  
  // Stop any playing audio
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
  
  // Reset all preview audio
  Object.values(previewAudioRefs.current).forEach(audio => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
  
  // Load voices if switching to predefined tab
  if (newTab === 'predefined') {
    loadPredefinedVoices();
  }
};

// Update the generateSample function:
const generateSample = async () => {
  if (!sampleText.trim()) {
    setError('Please enter some text to generate speech.');
    return;
  }

  setIsGenerating(true);
  setError(null);

  try {
    let audioUrl = null;

    if (voiceType === 'clone') {
      // For cloned voice, use Unmixr API
      if (!audioFile && !recordedBlob) {
        setError('Please record or upload an audio file first.');
        return;
      }

      const formData = new FormData();
      if (audioFile) {
        formData.append('audio', audioFile);
      } else if (recordedBlob) {
        formData.append('audio', new Blob([recordedBlob], { type: 'audio/wav' }));
      }
      formData.append('text', sampleText.trim());

      const response = await unmixrAPI.generateSample(
        'custom',
        sampleText.trim(),
        {
          voice_file: formData.get('audio')
        }
      );

      if (response.job_id) {
        let jobStatus = await unmixrAPI.getJobStatus(response.job_id);
        let attempts = 0;
        const maxAttempts = 30;

        while (jobStatus.status === 'processing' && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          jobStatus = await unmixrAPI.getJobStatus(response.job_id);
          attempts++;
        }

        if (jobStatus.status === 'completed' && jobStatus.audio_url) {
          audioUrl = jobStatus.audio_url;
        } else {
          throw new Error('Failed to generate speech sample');
        }
      }
    } else {
      // For predefined voice, use Unmixr's existing voices
      if (!selectedVoiceId) {
        setError('Please select a professional voice first.');
        return;
      }

      const result = await unmixrAPI.generateSample(selectedVoiceId, sampleText.trim());
      
      if (result.job_id) {
        let jobStatus = await unmixrAPI.getJobStatus(result.job_id);
        let attempts = 0;
        const maxAttempts = 30;
        
        while (jobStatus.status === 'processing' && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          jobStatus = await unmixrAPI.getJobStatus(result.job_id);
          attempts++;
        }
        
        if (jobStatus.status === 'completed' && jobStatus.audio_url) {
          audioUrl = jobStatus.audio_url;
        } else {
          throw new Error('Failed to generate speech sample');
        }
      }
    }

    if (!audioUrl) {
      throw new Error('Failed to generate audio');
    }

    setGeneratedAudio(audioUrl);
    setSuccess('Speech generated successfully!');
    
    // Set up audio player
    audioRef.current.src = audioUrl;
    audioRef.current.load();
  } catch (error) {
    console.error('Sample generation error:', error);
    setError('An error occurred during sample generation. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};

// Update the voice type selection buttons to use the new handler:
<button
  onClick={() => handleTabChange('clone')}
  className={`p-6 rounded-xl border-2 transition-all text-left ${
    voiceType === 'clone'
      ? 'border-blue-500 bg-blue-50 shadow-lg'
      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
  }`}
>
  {/* ... button content ... */}
</button>

<button
  onClick={() => handleTabChange('predefined')}
  className={`p-6 rounded-xl border-2 transition-all text-left ${
    voiceType === 'predefined'
      ? 'border-purple-500 bg-purple-50 shadow-lg'
      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
  }`}
>
  {/* ... button content ... */}
</button>

// Add uploaded/recorded voice preview section:
{(audioFile || recordedBlob) && (
  <div className="mt-4 bg-gray-50 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-gray-900">Voice Sample</h4>
        <p className="text-sm text-gray-600">
          {audioFile ? audioFile.name : 'Recorded audio'}
        </p>
      </div>
      <button
        onClick={() => {
          const url = audioFile 
            ? URL.createObjectURL(audioFile)
            : recordedBlob 
              ? URL.createObjectURL(recordedBlob)
              : null;
          
          if (url) {
            if (isPlaying) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              setIsPlaying(false);
            } else {
              audioRef.current.src = url;
              audioRef.current.play();
              setIsPlaying(true);
            }
          }
        }}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-4 h-4" />
        <span>{isPlaying ? 'Pause' : 'Play'}</span>
      </button>
    </div>
    
    {/* Audio Waveform Visualization */}
    {isPlaying && (
      <div className="flex items-center justify-center space-x-1 mt-4">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-blue-400 rounded-full"
            animate={{
              height: [4, 16, 8, 20, 6, 18, 10, 14, 4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.05,
            }}
          />
        ))}
      </div>
    )}
  </div>
)}