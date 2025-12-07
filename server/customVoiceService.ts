/**
 * Custom Voice Sample Generation Service with S3 Caching
 * 
 * This service generates custom audio samples using ElevenLabs Text-to-Speech API
 * for Fiction, Historical, and General narrative categories.
 * 
 * Audio files are cached in S3 storage to avoid repeated API calls and reduce costs.
 */

import { storagePut, storageGet } from './storage';

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
 * Generate S3 storage key for a voice sample
 */
function getStorageKey(sampleId: string): string {
  return `custom-voice-samples/${sampleId}.mp3`;
}

/**
 * Check if audio file exists in S3 storage and return URL if accessible
 */
async function checkAudioExists(sampleId: string): Promise<string | null> {
  try {
    const storageKey = getStorageKey(sampleId);
    console.log(`[CustomVoice] Checking cache for ${sampleId} at ${storageKey}`);
    
    const { url } = await storageGet(storageKey);
    
    // Verify the URL is accessible with a HEAD request
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      console.log(`[CustomVoice] ✓ Cache HIT for ${sampleId} - using cached audio`);
      return url;
    }
    
    console.log(`[CustomVoice] Cache MISS for ${sampleId} - URL not accessible`);
    return null;
  } catch (error) {
    console.log(`[CustomVoice] Cache MISS for ${sampleId} - file not found`);
    return null;
  }
}

/**
 * Generate audio using ElevenLabs TTS API
 */
async function generateAudioFromElevenLabs(
  voiceId: string,
  text: string
): Promise<Buffer> {
  console.log(`[CustomVoice] Calling ElevenLabs API for voice ${voiceId}`);
  
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

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  console.log(`[CustomVoice] ✓ Generated ${buffer.length} bytes of audio from ElevenLabs`);
  return buffer;
}

/**
 * Upload audio to S3 storage and return permanent public URL
 */
async function uploadAudioToS3(
  sampleId: string,
  audioBuffer: Buffer
): Promise<string> {
  const storageKey = getStorageKey(sampleId);
  console.log(`[CustomVoice] Uploading ${audioBuffer.length} bytes to S3 at ${storageKey}`);
  
  const { url } = await storagePut(storageKey, audioBuffer, 'audio/mpeg');
  
  console.log(`[CustomVoice] ✓ Cached audio for ${sampleId} at ${url}`);
  return url;
}

/**
 * Generate or retrieve cached audio for a single voice sample
 * This implements the check-then-generate caching pattern
 */
async function getOrGenerateAudio(sample: CustomVoiceSample): Promise<string> {
  // Step 1: Check if audio already exists in S3 cache
  const cachedUrl = await checkAudioExists(sample.id);
  if (cachedUrl) {
    return cachedUrl;
  }

  // Step 2: Cache miss - generate new audio from ElevenLabs
  console.log(`[CustomVoice] Generating NEW audio for ${sample.id}`);
  const audioBuffer = await generateAudioFromElevenLabs(
    sample.voiceId,
    sample.sampleText
  );

  // Step 3: Upload to S3 and return permanent URL
  const audioUrl = await uploadAudioToS3(sample.id, audioBuffer);
  
  return audioUrl;
}

/**
 * Get all custom voice samples with cached or generated audio URLs
 * This is the main function called by the tRPC router
 */
export async function getAllCustomSamplesWithAudio(): Promise<CustomVoiceSample[]> {
  console.log('[CustomVoice] Fetching all custom samples with audio...');
  
  // Process samples sequentially to avoid rate limits
  const samplesWithAudio: CustomVoiceSample[] = [];
  
  for (const sample of CUSTOM_VOICE_CONFIGS) {
    try {
      const audioUrl = await getOrGenerateAudio(sample);
      samplesWithAudio.push({
        ...sample,
        audioUrl,
      });
    } catch (error) {
      console.error(`[CustomVoice] ✗ Error processing audio for ${sample.id}:`, error);
      // Return sample without audio URL if processing fails
      samplesWithAudio.push(sample);
    }
  }
  
  console.log(`[CustomVoice] ✓ Completed processing ${samplesWithAudio.length} samples`);
  return samplesWithAudio;
}

/**
 * Get custom voice sample configurations without audio URLs
 * This is a fast endpoint that doesn't require API calls or S3 access
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
 * Legacy function - kept for backward compatibility
 * @deprecated Use getAllCustomSamplesWithAudio instead
 */
export async function generateAllCustomSamples(): Promise<CustomVoiceSample[]> {
  return getAllCustomSamplesWithAudio();
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Audio generation is now handled internally with caching
 */
export async function generateCustomVoiceSample(
  voiceId: string,
  text: string
): Promise<string> {
  const audioBuffer = await generateAudioFromElevenLabs(voiceId, text);
  const base64Audio = audioBuffer.toString('base64');
  return `data:audio/mpeg;base64,${base64Audio}`;
}
