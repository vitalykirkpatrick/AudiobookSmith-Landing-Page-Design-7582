// Add these functions to the VoiceApiService class:

// Play preview of cloned voice
async playPreviewSample(voiceId, sampleText) {
  try {
    const response = await this.elevenlabs.generateSpeech(
      voiceId,
      sampleText || "Hello! This is a preview of your cloned voice. How do I sound?",
      {
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75
        }
      }
    );

    return {
      success: true,
      audio_url: URL.createObjectURL(response),
      message: 'Preview generated successfully!'
    };
  } catch (error) {
    console.error('Error generating preview:', error);
    return {
      success: false,
      message: error.message || 'Failed to generate preview'
    };
  }
}

// Get preview for standard voice
async getVoicePreview(voiceId) {
  try {
    const voice = elevenlabsVoices.find(v => v.id === voiceId);
    if (!voice) {
      throw new Error('Voice not found');
    }
    
    const response = await fetch(voice.preview_url);
    if (!response.ok) {
      throw new Error('Failed to fetch voice preview');
    }
    
    const audioBlob = await response.blob();
    return {
      success: true,
      audio_url: URL.createObjectURL(audioBlob),
      message: 'Preview loaded successfully!'
    };
  } catch (error) {
    console.error('Error loading voice preview:', error);
    return {
      success: false,
      message: error.message || 'Failed to load preview'
    };
  }
}

// Select a standard voice
selectVoice(voiceId) {
  const voice = elevenlabsVoices.find(v => v.id === voiceId);
  if (!voice) {
    throw new Error('Voice not found');
  }
  return {
    voice_id: voice.id,
    name: voice.name,
    settings: {
      stability: 0.75,
      similarity_boost: 0.75
    }
  };
}