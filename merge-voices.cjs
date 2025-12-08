// Merge GitHub voice metadata with current voices-data.json
const fs = require('fs');
const path = require('path');

// Read current voices
const currentVoices = JSON.parse(fs.readFileSync('server/voices-data.json', 'utf-8'));

// Read GitHub metadata
const githubMetadataContent = fs.readFileSync('voice-metadata-github.js', 'utf-8');

// Extract voice metadata object
const metadataMatch = githubMetadataContent.match(/export const voiceMetadata = \{([\s\S]+)\};/);
if (!metadataMatch) {
  console.error('Could not parse voice metadata');
  process.exit(1);
}

console.log(`Current voices: ${currentVoices.length}`);
console.log(`Foreign language voices with audio:`, currentVoices.filter(v => v.language !== 'en-US').map(v => v.character));

// Update current voices with GitHub metadata where character names match
let updated = 0;
currentVoices.forEach(voice => {
  // Check if this voice exists in GitHub metadata
  const githubPattern = new RegExp(`"${voice.character}"\\s*:\\s*\\{([^}]+)\\}`, 's');
  const match = metadataMatch[1].match(githubPattern);
  
  if (match) {
    const metaBlock = match[1];
    
    // Extract fields
    const aliasMatch = metaBlock.match(/alias:\s*"([^"]+)"/);
    const tagsMatch = metaBlock.match(/tags:\s*\[([^\]]+)\]/);
    const descMatch = metaBlock.match(/description:\s*"([^"]+)"/);
    
    if (aliasMatch) voice.alias = aliasMatch[1];
    if (tagsMatch) {
      voice.tags = tagsMatch[1].split(',').map(t => t.trim().replace(/"/g, ''));
    }
    if (descMatch) voice.description = descMatch[1];
    
    updated++;
    console.log(`✓ Updated ${voice.character} with GitHub metadata`);
  }
});

// Write updated voices
fs.writeFileSync('server/voices-data.json', JSON.stringify(currentVoices, null, 2));
console.log(`\n✓ Updated ${updated} voices with GitHub metadata`);
console.log(`✓ Total voices: ${currentVoices.length}`);
