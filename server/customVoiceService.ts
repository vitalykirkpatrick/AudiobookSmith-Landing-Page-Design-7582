/**
 * Custom Voice Sample Generation Service
 * 
 * This service generates custom audio samples using ElevenLabs Text-to-Speech API
 * for Fiction, Historical, and General narrative categories.
 */

const ELEVENLABS_API_KEY = 'sk_ea6ecc9b4f9510cc4a0e8b109408e65272152c7e918bca24';
const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

export interface CustomVoiceSample {
  id: string;
  category: 'Fiction' | 'Historical' | 'General';
  title: string;
  gender: 'FEMALE' | 'MALE';
  description: string;
  sampleText: string;
  traits: string[];
  voiceName: string;
  accent: string;
  bestFor: string[];
  voiceId: string;
  audioUrl?: string;
}

/**
 * High-quality narrative voices selected for custom samples
 * These voices are specifically chosen for their storytelling and narration quality
 */
const CUSTOM_VOICE_CONFIGS: CustomVoiceSample[] = [
  {
    id: 'fiction-sample',
    category: 'Fiction',
    title: 'Fiction Sample',
    gender: 'FEMALE',
    description: 'Perfect for gothic romance and dark fantasy narratives. Rich, haunting voice with elegant British accent.',
    sampleText: 'In the shadows of Blackthorne Manor, secrets whispered through ancient halls, carried on winds that spoke of forgotten tales and forbidden love.',
    traits: ['Mysterious', 'Elegant', 'Dramatic'],
    voiceName: 'Aria',
    accent: 'British Accent',
    bestFor: ['Gothic Romance', 'Dark Fantasy', 'Mystery'],
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - expressive female voice
  },
  {
    id: 'historical-sample',
    category: 'Historical',
    title: 'Historical Sample',
    gender: 'MALE',
    description: 'Refined and authoritative British voice for historical fiction and period dramas.',
    sampleText: 'Lord Ashworth surveyed his estate from the manor\'s highest window, contemplating how much had changed since the war began.',
    traits: ['Refined', 'Authoritative', 'Distinguished'],
    voiceName: 'George',
    accent: 'British Accent',
    bestFor: ['Historical Fiction', 'Period Drama', 'Classic Literature'],
    voiceId: 'pqHfZKP75CvOlQylNhV4', // Bill - mature British voice
  },
  {
    id: 'general-sample',
    category: 'General',
    title: 'General Sample',
    gender: 'FEMALE',
    description: 'Versatile and engaging voice suitable for any genre. Flowing and natural tone.',
    sampleText: 'Stories have a way of finding their own path, like rivers flowing to the sea, carrying us along on currents of imagination.',
    traits: ['Versatile', 'Engaging', 'Natural'],
    voiceName: 'River',
    accent: 'American Accent',
    bestFor: ['General Narration', 'Contemporary Fiction', 'Non-Fiction'],
    voiceId: 'ThT5KcBeYPX3keUQqHPh', // Dorothy - versatile female voice
  },
];

/**
 * Generate audio for a custom voice sample using ElevenLabs TTS API
 */
export async function generateCustomVoiceSample(
  voiceId: string,
  text: string
): Promise<string> {
  try {
    const response = await fetch(`${ELEVENLABS_TTS_URL}/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Convert audio blob to base64 data URL
    const audioBlob = await response.blob();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');
    const dataUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return dataUrl;
  } catch (error) {
    console.error('Error generating custom voice sample:', error);
    throw error;
  }
}

/**
 * Get all custom voice sample configurations
 */
export function getCustomVoiceSamples(): CustomVoiceSample[] {
  return CUSTOM_VOICE_CONFIGS;
}

/**
 * Get a specific custom voice sample by ID
 */
export function getCustomVoiceSampleById(id: string): CustomVoiceSample | undefined {
  return CUSTOM_VOICE_CONFIGS.find(sample => sample.id === id);
}

/**
 * Generate audio for all custom voice samples
 * This is called when the frontend requests the custom samples
 */
export async function generateAllCustomSamples(): Promise<CustomVoiceSample[]> {
  const samplesWithAudio = await Promise.all(
    CUSTOM_VOICE_CONFIGS.map(async (sample) => {
      try {
        const audioUrl = await generateCustomVoiceSample(sample.voiceId, sample.sampleText);
        return {
          ...sample,
          audioUrl,
        };
      } catch (error) {
        console.error(`Error generating audio for ${sample.id}:`, error);
        return sample; // Return without audio URL if generation fails
      }
    })
  );

  return samplesWithAudio;
}
