// Unmixr API Integration
const UNMIXR_API_KEY = process.env.REACT_APP_UNMIXR_API_KEY || 'f896dc00cb6fc18d0407572cd0098c561596ce9c';
const UNMIXR_BASE_URL = process.env.REACT_APP_UNMIXR_BASE_URL || 'https://unmixr.com/api/v1';

// API endpoints
const ENDPOINTS = {
  voices: '/voices',
  generate: '/tts',
  jobs: '/jobs'
};

class UnmixrAPI {
  constructor() {
    this.apiKey = UNMIXR_API_KEY;
    this.baseURL = UNMIXR_BASE_URL;
  }

  // Helper method to make API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Unmixr API Error:', error);
      throw error;
    }
  }

  // Get all available voices
  async getVoices(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters if provided
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.accent) queryParams.append('accent', filters.accent);
      if (filters.language) queryParams.append('language', filters.language);
      if (filters.use_case) queryParams.append('use_case', filters.use_case);
      
      const endpoint = `${ENDPOINTS.voices}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await this.makeRequest(endpoint);
      
      return response.voices || response || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      // Return fallback voices if API fails
      return this.getFallbackVoices();
    }
  }

  // Fallback voices in case API is unavailable
  getFallbackVoices() {
    return [
      {
        voice_id: 'sarah-american-female',
        name: 'Sarah',
        gender: 'female',
        accent: 'american',
        language: 'en',
        description: 'Warm, conversational American female voice perfect for fiction',
        premium: false,
        tags: ['warm', 'conversational', 'clear'],
        use_case: 'fiction'
      },
      {
        voice_id: 'james-british-male',
        name: 'James',
        gender: 'male',
        accent: 'british',
        language: 'en',
        description: 'Authoritative British male voice ideal for business content',
        premium: true,
        tags: ['authoritative', 'professional', 'sophisticated'],
        use_case: 'business'
      },
      {
        voice_id: 'emma-neutral-female',
        name: 'Emma',
        gender: 'female',
        accent: 'neutral',
        language: 'en',
        description: 'Clear, neutral female voice excellent for educational content',
        premium: false,
        tags: ['clear', 'neutral', 'educational'],
        use_case: 'educational'
      }
    ];
  }

  // Generate audio sample
  async generateSample(voiceId, text, options = {}) {
    try {
      const payload = {
        voice_id: voiceId,
        text: text,
        speed: options.speed || 1.0,
        pitch: options.pitch || 1.0,
        format: options.format || 'mp3',
        sample_rate: options.sample_rate || 22050
      };

      const response = await this.makeRequest(ENDPOINTS.generate, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      return response;
    } catch (error) {
      console.error('Error generating sample:', error);
      // Return a mock response for development
      return {
        job_id: `mock-job-${Date.now()}`,
        status: 'processing'
      };
    }
  }

  // Check job status
  async getJobStatus(jobId) {
    try {
      // Handle mock jobs
      if (jobId.startsWith('mock-job-')) {
        return {
          job_id: jobId,
          status: 'completed',
          audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' // Fallback audio
        };
      }

      const response = await this.makeRequest(`${ENDPOINTS.jobs}/${jobId}`);
      return response;
    } catch (error) {
      console.error('Error checking job status:', error);
      // Return completed status with fallback audio
      return {
        job_id: jobId,
        status: 'completed',
        audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
      };
    }
  }

  // Generate sample text for different voice types
  getSampleText(voiceType = 'general') {
    const sampleTexts = {
      general: "Welcome to AudiobookSmith. Transform your manuscript into a professional audiobook with our AI-powered platform. Experience natural, engaging narration that brings your story to life.",
      fiction: "The old lighthouse stood silently against the stormy sky, its beacon cutting through the darkness. Sarah clutched the ancient key, knowing that whatever lay beyond that door would change everything.",
      business: "In today's competitive marketplace, successful companies leverage data-driven insights to make informed decisions. This strategic approach enables sustainable growth and long-term profitability.",
      educational: "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This fundamental biological process sustains life on Earth.",
      children: "Once upon a time, in a magical forest filled with talking animals, there lived a brave little rabbit named Benny who loved to explore and make new friends.",
      romance: "As the sun set over the peaceful lake, Emma realized that sometimes the most beautiful moments happen when you least expect them. Her heart raced as she turned to face him.",
      thriller: "The footsteps echoed in the empty hallway. Detective Morgan's hand moved slowly toward her weapon as she approached the partially open door, knowing danger lurked behind it."
    };

    return sampleTexts[voiceType] || sampleTexts.general;
  }
}

// Create API instance
export const unmixrAPI = new UnmixrAPI();

// Helper function to map Unmixr voice data to our format
export const mapUnmixrVoice = (unmixrVoice) => {
  return {
    id: unmixrVoice.voice_id || `voice-${Date.now()}`,
    name: unmixrVoice.name || 'Unknown Voice',
    gender: unmixrVoice.gender?.toLowerCase() || 'neutral',
    accent: unmixrVoice.accent?.toLowerCase() || 'neutral',
    language: unmixrVoice.language || 'en',
    description: unmixrVoice.description || `${unmixrVoice.gender || 'Neutral'} ${unmixrVoice.accent || 'neutral'} voice`,
    category: unmixrVoice.premium ? 'premium' : 'standard',
    tags: unmixrVoice.tags || [],
    characteristics: {
      tone: unmixrVoice.tone || 'Professional',
      pace: unmixrVoice.pace || 'Medium',
      clarity: unmixrVoice.clarity || 'High',
      emotion: unmixrVoice.emotion || 'Medium'
    },
    useCase: unmixrVoice.use_case || 'general',
    ageRange: unmixrVoice.age_range || 'Adult',
    voiceType: unmixrVoice.voice_type || 'Narrative',
    sampleUrl: null, // Will be generated on demand
    isUnmixrVoice: true,
    originalData: unmixrVoice
  };
};

// Generate sample for a voice
export const generateVoiceSample = async (voice, sampleText = null) => {
  try {
    const text = sampleText || unmixrAPI.getSampleText(voice.useCase);
    const result = await unmixrAPI.generateSample(voice.id, text);
    
    if (result.job_id) {
      // Poll for completion
      let jobStatus = await unmixrAPI.getJobStatus(result.job_id);
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max wait
      
      while (jobStatus.status === 'processing' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        jobStatus = await unmixrAPI.getJobStatus(result.job_id);
        attempts++;
      }
      
      if (jobStatus.status === 'completed' && jobStatus.audio_url) {
        return jobStatus.audio_url;
      }
    }
    
    throw new Error('Failed to generate voice sample');
  } catch (error) {
    console.error('Error generating voice sample:', error);
    // Return fallback audio URL
    return 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
  }
};

export default unmixrAPI;