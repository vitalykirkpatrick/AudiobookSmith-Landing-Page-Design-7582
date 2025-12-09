// ElevenLabs API Integration
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_b006ebce7fa44b04bdc0037b5858fbdaa62e85688177a5b4';
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

class ElevenLabsAPI {
  constructor() {
    this.apiKey = ELEVENLABS_API_KEY;
    this.baseURL = ELEVENLABS_BASE_URL;
  }

  // Helper method for API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('ElevenLabs API Error:', error);
      throw error;
    }
  }

  // Add a new voice
  async addVoice(name, audioFile, description = '') {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('files', audioFile);
    formData.append('description', description);

    return await this.makeRequest('/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
        // Don't set Content-Type here, let browser set it for FormData
      },
      body: formData
    });
  }

  // Generate speech from text using a specific voice
  async generateSpeech(voiceId, text, options = {}) {
    const defaultOptions = {
      model_id: 'eleven_multilingual_v2', // Use v2 for better quality
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    };

    const payload = {
      text,
      ...defaultOptions,
      ...options
    };

    const response = await fetch(`${this.baseURL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Speech generation failed: ${response.status}`);
    }

    // Return audio blob
    return await response.blob();
  }

  // Get all voices
  async getVoices() {
    return await this.makeRequest('/voices');
  }

  // Get a specific voice
  async getVoice(voiceId) {
    return await this.makeRequest(`/voices/${voiceId}`);
  }

  // Delete a voice
  async deleteVoice(voiceId) {
    return await this.makeRequest(`/voices/${voiceId}`, {
      method: 'DELETE'
    });
  }

  // Edit voice settings
  async editVoice(voiceId, settings) {
    return await this.makeRequest(`/voices/${voiceId}/settings/edit`, {
      method: 'POST',
      body: JSON.stringify(settings)
    });
  }
}

export const elevenlabsApi = new ElevenLabsAPI();

// Permission text that users need to read
export const voicePermissionText = `I, [state your full name], hereby grant AudiobookSmith permission to use this voice recording to create an AI voice model for generating audio content based on my manuscript. I understand that this voice sample will be used solely for creating my audiobook and will not be shared with third parties or used for any other commercial purposes without my explicit consent. I confirm that I am the rightful owner of this voice recording and have the authority to grant this permission.`;

export default elevenlabsApi;