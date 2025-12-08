/**
 * Generate audio samples for foreign language voices using ElevenLabs multilingual model
 * This script generates preview audio for Spanish, French, German, Italian, Portuguese, Hindi, Polish voices
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { storagePut } from './storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ELEVENLABS_API_KEY = 'sk_ea6ecc9b4f9510cc4a0e8b109408e65272152c7e918bca24';
const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Sample texts in different languages
const SAMPLE_TEXTS: Record<string, string> = {
  es: "En las sombras del antiguo castillo, los secretos susurraban a través de los pasillos.",
  fr: "Dans les ombres du vieux château, les secrets murmuraient à travers les couloirs.",
  de: "In den Schatten des alten Schlosses flüsterten Geheimnisse durch die Flure.",
  it: "Nelle ombre del vecchio castello, i segreti sussurravano attraverso i corridoi.",
  pt: "Nas sombras do antigo castelo, os segredos sussurravam pelos corredores.",
  hi: "पुराने महल की छाया में, रहस्य गलियारों में फुसफुसाते थे।",
  pl: "W cieniach starego zamku sekrety szeptały przez korytarze."
};

interface Voice {
  id: string;
  character: string;
  elevenlabs_voice_id: string;
  language: string;
  preview_url: string;
}

/**
 * Generate audio using ElevenLabs multilingual model
 */
async function generateMultilingualAudio(
  voiceId: string,
  text: string,
  language: string
): Promise<Buffer> {
  console.log(`Generating audio for voice ${voiceId} in language ${language}...`);
  
  const response = await fetch(`${ELEVENLABS_TTS_URL}/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2', // Use multilingual model
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
  
  console.log(`✓ Generated ${buffer.length} bytes of audio`);
  return buffer;
}

/**
 * Upload audio to S3 and return public URL
 */
async function uploadToS3(voiceId: string, language: string, audioBuffer: Buffer): Promise<string> {
  const storageKey = `voice-samples/${language}/${voiceId}.mp3`;
  console.log(`Uploading to S3: ${storageKey}`);
  
  const { url } = await storagePut(storageKey, audioBuffer, 'audio/mpeg');
  
  console.log(`✓ Uploaded to ${url}`);
  return url;
}

/**
 * Generate audio samples for all foreign language voices
 */
async function generateAllSamples() {
  const voicesDataPath = path.join(__dirname, 'voices-data.json');
  const voices: Voice[] = JSON.parse(fs.readFileSync(voicesDataPath, 'utf-8'));
  
  // Filter foreign language voices (non-English)
  const foreignVoices = voices.filter(v => 
    v.language !== 'en-US' && v.language !== 'en-GB' && v.language !== 'en'
  );
  
  console.log(`Found ${foreignVoices.length} foreign language voices to process`);
  
  // Process each voice sequentially to avoid rate limits
  for (const voice of foreignVoices) {
    try {
      const sampleText = SAMPLE_TEXTS[voice.language];
      if (!sampleText) {
        console.warn(`⚠ No sample text for language ${voice.language}, skipping ${voice.character}`);
        continue;
      }
      
      // Generate audio
      const audioBuffer = await generateMultilingualAudio(
        voice.elevenlabs_voice_id,
        sampleText,
        voice.language
      );
      
      // Upload to S3
      const audioUrl = await uploadToS3(
        voice.id,
        voice.language,
        audioBuffer
      );
      
      // Update voice preview_url
      voice.preview_url = audioUrl;
      
      console.log(`✓ Completed ${voice.character} (${voice.language})\n`);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`✗ Error processing ${voice.character}:`, error);
    }
  }
  
  // Write updated voices back to file
  fs.writeFileSync(voicesDataPath, JSON.stringify(voices, null, 2));
  console.log(`\n✓ Updated voices-data.json with audio URLs for ${foreignVoices.length} voices`);
}

// Run the script
generateAllSamples().catch(console.error);
