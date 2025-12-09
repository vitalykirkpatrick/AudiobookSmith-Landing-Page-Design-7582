// Voice Cloning API Integration
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

class VoiceCloningAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      headers: {
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `API request failed: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Voice Cloning API Error:', error);
      throw error;
    }
  }

  // Clone a voice using audio file
  async cloneVoice(audioFile, voiceName) {
    try {
      const formData = new FormData();
      formData.append('audio_file', audioFile);
      formData.append('voice_name', voiceName);

      const response = await this.makeRequest('/clone-voice', {
        method: 'POST',
        body: formData
      });
      return response;
    } catch (error) {
      throw new Error(`Voice cloning failed: ${error.message}`);
    }
  }

  // Generate speech sample using cloned voice
  async generateSample(voiceId, text) {
    try {
      if (!voiceId || !text) {
        throw new Error('Voice ID and text are required');
      }
      if (text.length > 1000) {
        throw new Error('Text must be 1000 characters or less');
      }

      const response = await this.makeRequest('/generate-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voice_id: voiceId,
          text: text.trim()
        })
      });
      return response;
    } catch (error) {
      throw new Error(`Sample generation failed: ${error.message}`);
    }
  }

  // Get available professional voices
  async getAvailableVoices() {
    try {
      const response = await this.makeRequest('/available-voices');
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch available voices: ${error.message}`);
    }
  }

  // Get list of cloned voices
  async getClonedVoices() {
    try {
      const response = await this.makeRequest('/voices');
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch cloned voices: ${error.message}`);
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.makeRequest('/health');
      return response;
    } catch (error) {
      throw new Error(`Service health check failed: ${error.message}`);
    }
  }

  // Validate audio file before upload
  validateAudioFile(file) {
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/x-wav', 'audio/webm'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!file) {
      throw new Error('No file provided');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload MP3 or WAV files only.');
    }

    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB.');
    }

    return true;
  }

  // Convert audio blob to appropriate format for upload
  async prepareAudioForUpload(audioBlob, fileName = 'recording.wav') {
    try {
      // Create a File object from the blob
      const file = new File([audioBlob], fileName, { type: audioBlob.type || 'audio/wav' });
      
      // Validate the file
      this.validateAudioFile(file);
      
      return file;
    } catch (error) {
      throw new Error(`Audio preparation failed: ${error.message}`);
    }
  }

  // Get audio duration (utility function)
  async getAudioDuration(audioFile) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(audioFile);
      
      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(objectUrl);
        resolve(audio.duration);
      });
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load audio file'));
      });
      
      audio.src = objectUrl;
    });
  }

  // Validate audio duration
  async validateAudioDuration(audioFile, minDuration = 10, maxDuration = 30) {
    try {
      const duration = await this.getAudioDuration(audioFile);
      
      if (duration < minDuration) {
        throw new Error(`Audio must be at least ${minDuration} seconds long`);
      }
      
      if (duration > maxDuration) {
        throw new Error(`Audio must be no longer than ${maxDuration} seconds`);
      }
      
      return duration;
    } catch (error) {
      throw new Error(`Audio validation failed: ${error.message}`);
    }
  }
}

// Create API instance
export const voiceCloningAPI = new VoiceCloningAPI();

// Export utility functions
export const validateVoiceName = (name) => {
  if (!name || !name.trim()) {
    throw new Error('Voice name is required');
  }
  
  if (name.length < 2) {
    throw new Error('Voice name must be at least 2 characters long');
  }
  
  if (name.length > 50) {
    throw new Error('Voice name must be less than 50 characters');
  }
  
  // Check for invalid characters - fixed the regex to remove unnecessary escape
  const invalidChars = /[<>:"\\|?*]/;
  if (invalidChars.test(name)) {
    throw new Error('Voice name contains invalid characters');
  }
  
  return name.trim();
};

export const validateSampleText = (text) => {
  if (!text || !text.trim()) {
    throw new Error('Sample text is required');
  }
  
  if (text.length > 1000) {
    throw new Error('Sample text must be 1000 characters or less');
  }
  
  if (text.length < 10) {
    throw new Error('Sample text must be at least 10 characters long');
  }
  
  return text.trim();
};

export default voiceCloningAPI;