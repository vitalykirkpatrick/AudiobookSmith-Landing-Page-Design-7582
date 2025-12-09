import { elevenlabsApi } from './elevenlabsApi';
import database from '../lib/database';

/**
 * Handles the "Generate Once, Store, and Retrieve" pattern for voice samples.
 * Uses the backend database to check for existing samples before generating.
 */
export const getVoiceSample = async (voiceId, text) => {
  if (!voiceId || !text) return null;

  // Create a simplified hash/key for the text to use as a lookup
  // We use the first 30 chars + length to create a reproducible key
  const textHash = `${text.substring(0, 30).replace(/[^a-z0-9]/gi, '_')}_${text.length}`;
  const filename = `sample_${voiceId}_${textHash}.mp3`;

  try {
    // Step 1: Check Server DB for existing sample
    // This is the global check - "if they have not been stored yet"
    const checkResult = await database.getDemoSample(voiceId, textHash);
    
    // If backend is reachable and found a sample
    if (checkResult && checkResult.found && checkResult.audio_url) {
      console.log(`Found existing sample for ${voiceId}`);
      return checkResult.audio_url;
    }
    
    // If backend reported offline, log it once and proceed
    if (checkResult && checkResult.offline) {
        // Silent continuation - don't log error
    } else {
        console.log(`Generating NEW sample for ${voiceId}...`);
    }

    // Step 2: Generate Voice via ElevenLabs API
    const audioBlob = await elevenlabsApi.generateSpeech(voiceId, text);
    
    // If generation failed, return null
    if (!audioBlob) return null;

    // Step 3: Store into "S3" (via our backend public upload endpoint)
    // Only attempt upload if backend is actually available
    if (database.isBackendAvailable) {
        const audioFile = new File([audioBlob], filename, { type: 'audio/mpeg' });
        
        try {
            const uploadResult = await database.uploadDemo(audioFile, voiceId, textHash);
            if (uploadResult && uploadResult.url) {
                return uploadResult.url;
            } 
        } catch (uploadErr) {
            // If upload fails, just use local blob, no need to scream in console
            // console.warn("Storage upload failed, using local blob");
        }
    }

    // Fallback: If storage fails or backend offline, return local blob
    return URL.createObjectURL(audioBlob);

  } catch (err) {
    console.error("Error in voice generation flow:", err);
    return null;
  }
};