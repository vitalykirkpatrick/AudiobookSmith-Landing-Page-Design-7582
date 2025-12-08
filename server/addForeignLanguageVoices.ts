/**
 * Script to add foreign language voices to voices-data.json
 * Uses ElevenLabs multilingual voices with proper language codes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Foreign language voices with ElevenLabs voice IDs that support multilingual model
const FOREIGN_LANGUAGE_VOICES = [
  {
    id: "elv-038",
    category: "romantic",
    character: "Elena",
    elevenlabs_voice_id: "EXAVITQu4vr4xnSDxMaL", // Sarah - supports multilingual
    elevenlabs_name: "Elena - Spanish Female Voice",
    gender: "Female",
    age: "Adult",
    accent: "Spanish (Spain)",
    language: "es", // Spanish
    preview_url: "", // Will be generated
    description: "A passionate Spanish female voice with deep emotional range. Perfect for dramatic storytelling, poetry, and intense narratives in Spanish.",
    descriptive: "passionate",
    use_case: "narrative_story"
  },
  {
    id: "elv-039",
    category: "poetic",
    character: "Marc",
    elevenlabs_voice_id: "pqHfZKP75CvOlQylNhV4", // Bill - supports multilingual
    elevenlabs_name: "Marc - French Male Voice",
    gender: "Male",
    age: "Adult",
    accent: "French",
    language: "fr", // French
    preview_url: "",
    description: "A soft, lyrical French male voice. Bringing the charm of Paris to life, ideal for romance, poetry, and artistic narration in French.",
    descriptive: "lyrical",
    use_case: "narrative_story"
  },
  {
    id: "elv-040",
    category: "documentary-narrator",
    character: "Ingrid",
    elevenlabs_voice_id: "ThT5KcBeYPX3keUQqHPh", // Dorothy - supports multilingual
    elevenlabs_name: "Ingrid - German Female Voice",
    gender: "Female",
    age: "Older",
    accent: "German",
    language: "de", // German
    preview_url: "",
    description: "A deep, resonant German female voice. Perfect for historical documentaries, serious non-fiction, and authoritative news delivery in German.",
    descriptive: "authoritative",
    use_case: "narrative_story"
  },
  {
    id: "elv-041",
    category: "dramatic",
    character: "Carlo",
    elevenlabs_voice_id: "VR6AewLTigWG4xSOukaG", // Arnold - supports multilingual
    elevenlabs_name: "Carlo - Italian Male Voice",
    gender: "Male",
    age: "Adult",
    accent: "Italian",
    language: "it", // Italian
    preview_url: "",
    description: "A powerful, dramatic Italian male voice. Brings intensity to opera narrations, art history, and high-fashion commercials in Italian.",
    descriptive: "powerful",
    use_case: "narrative_story"
  },
  {
    id: "elv-042",
    category: "adventurer",
    character: "Helena",
    elevenlabs_voice_id: "21m00Tcm4TlvDq8ikWAM", // Rachel - supports multilingual
    elevenlabs_name: "Helena - Portuguese Female Voice",
    gender: "Female",
    age: "Adult",
    accent: "Portuguese (EU)",
    language: "pt", // Portuguese
    preview_url: "",
    description: "A clear, adventurous Portuguese female voice. Suitable for travel documentaries, exploration narratives, and European content in Portuguese.",
    descriptive: "adventurous",
    use_case: "narrative_story"
  },
  {
    id: "elv-043",
    category: "gentle",
    character: "Aarav",
    elevenlabs_voice_id: "nPczCjzI2devNBz1zQrb", // Brian - supports multilingual
    elevenlabs_name: "Aarav - Hindi Male Voice",
    gender: "Male",
    age: "Older",
    accent: "Hindi",
    language: "hi", // Hindi
    preview_url: "",
    description: "A calm, wise Hindi male voice. Ideal for spiritual content, meditation guides, and traditional Indian storytelling in Hindi.",
    descriptive: "wise",
    use_case: "narrative_story"
  },
  {
    id: "elv-044",
    category: "storyteller",
    character: "Marek",
    elevenlabs_voice_id: "yoZ06aMxZJJ28mfd3POQ", // Sam - supports multilingual
    elevenlabs_name: "Marek - Polish Male Voice",
    gender: "Male",
    age: "Young Adult",
    accent: "Polish",
    language: "pl", // Polish
    preview_url: "",
    description: "A gentle Polish male voice with a dreamlike quality. Excellent for fairy tales, children's books, and soft commercial content in Polish.",
    descriptive: "dreamlike",
    use_case: "narrative_story"
  }
];

// Sample texts in different languages for preview generation
const SAMPLE_TEXTS: Record<string, string> = {
  es: "En las sombras del antiguo castillo, los secretos susurraban a través de los pasillos, llevados por vientos que hablaban de cuentos olvidados.",
  fr: "Dans les ombres du vieux château, les secrets murmuraient à travers les couloirs, portés par des vents qui parlaient de contes oubliés.",
  de: "In den Schatten des alten Schlosses flüsterten Geheimnisse durch die Flure, getragen von Winden, die von vergessenen Geschichten erzählten.",
  it: "Nelle ombre del vecchio castello, i segreti sussurravano attraverso i corridoi, portati da venti che parlavano di racconti dimenticati.",
  pt: "Nas sombras do antigo castelo, os segredos sussurravam pelos corredores, levados por ventos que falavam de contos esquecidos.",
  hi: "पुराने महल की छाया में, रहस्य गलियारों में फुसफुसाते थे, हवाओं द्वारा ले जाए गए जो भूली हुई कहानियों की बात करते थे।",
  pl: "W cieniach starego zamku sekrety szeptały przez korytarze, niesione wiatrami, które mówiły o zapomnianych opowieściach."
};

async function addForeignLanguageVoices() {
  const voicesDataPath = path.join(__dirname, 'voices-data.json');
  
  // Read existing voices
  const existingVoices = JSON.parse(fs.readFileSync(voicesDataPath, 'utf-8'));
  
  console.log(`Current voices: ${existingVoices.length}`);
  console.log(`Adding ${FOREIGN_LANGUAGE_VOICES.length} foreign language voices...`);
  
  // Add foreign language voices
  const updatedVoices = [...existingVoices, ...FOREIGN_LANGUAGE_VOICES];
  
  // Write back to file
  fs.writeFileSync(voicesDataPath, JSON.stringify(updatedVoices, null, 2));
  
  console.log(`✓ Updated voices-data.json with ${updatedVoices.length} total voices`);
  console.log(`✓ Added voices for languages: Spanish, French, German, Italian, Portuguese, Hindi, Polish`);
}

addForeignLanguageVoices().catch(console.error);
