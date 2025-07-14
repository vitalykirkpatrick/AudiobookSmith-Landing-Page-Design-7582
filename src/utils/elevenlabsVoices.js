export const elevenlabsVoices = [
  {
    id: 'aria',
    name: 'Aria (Lady Evangeline Blackthorne)',
    gender: 'Female',
    language: 'en-US',
    description: 'Perfect for gothic romance and dark fantasy narratives. Rich, haunting voice with elegant British accent.',
    category: 'Fiction',
    accent: 'British',
    use_cases: ['Gothic Romance', 'Dark Fantasy', 'Period Drama'],
    personality: ['Mysterious', 'Elegant', 'Dramatic'],
    preview_url: 'https://api.elevenlabs.io/v1/voices/aria/preview',
    sampleText: "In the shadows of Blackthorne Manor, secrets whispered through ancient halls, carried on winds that spoke of forgotten tales and forbidden love."
  },
  {
    id: 'sarah',
    name: 'Sarah (Captain Elena Stormwind)',
    gender: 'Female',
    language: 'en-US',
    description: 'Bold and adventurous voice ideal for maritime stories and action-packed narratives.',
    category: 'Adventure',
    accent: 'American',
    use_cases: ['Adventure', 'Maritime', 'Action'],
    personality: ['Bold', 'Confident', 'Adventurous'],
    preview_url: 'https://api.elevenlabs.io/v1/voices/sarah/preview',
    sampleText: "The storm raged against the Stormwind's bow, but Captain Elena stood firm, her eyes fixed on the horizon where adventure awaited."
  },
  {
    id: 'laura',
    name: 'Laura (Professor Amelia Blackwood)',
    gender: 'Female',
    language: 'en-US',
    description: 'Sophisticated and analytical voice perfect for mysteries and academic content.',
    category: 'Mystery',
    accent: 'American',
    use_cases: ['Mystery', 'Thriller', 'Academic'],
    personality: ['Intelligent', 'Analytical', 'Sophisticated'],
    preview_url: 'https://api.elevenlabs.io/v1/voices/laura/preview',
    sampleText: "Professor Blackwood examined the cryptic symbols, her mind racing through centuries of historical precedents that might unlock their meaning."
  },
  {
    id: 'charlie',
    name: 'Charlie (Detective Marcus Kane)',
    gender: 'Male',
    language: 'en-US',
    description: 'Gritty and determined voice for detective stories and contemporary fiction.',
    category: 'Crime',
    accent: 'American',
    use_cases: ['Detective', 'Crime', 'Contemporary'],
    personality: ['Determined', 'Gritty', 'Sharp'],
    preview_url: 'https://api.elevenlabs.io/v1/voices/charlie/preview',
    sampleText: "The rain-slicked streets of downtown held their secrets close, but Detective Kane had learned long ago how to make the city talk."
  },
  {
    id: 'george',
    name: 'George (Lord Edmund Ashworth)',
    gender: 'Male',
    language: 'en-GB',
    description: 'Refined and authoritative British voice for historical fiction and period dramas.',
    category: 'Historical',
    accent: 'British',
    use_cases: ['Historical Fiction', 'Period Drama'],
    personality: ['Refined', 'Authoritative', 'Distinguished'],
    preview_url: 'https://api.elevenlabs.io/v1/voices/george/preview',
    sampleText: "Lord Ashworth surveyed his estate from the manor's highest window, contemplating how much had changed since the war began."
  },
  {
    id: 'callum',
    name: 'Callum (Brother Thomas)',
    gender: 'Male',
    language: 'en-GB',
    description: 'Thoughtful and contemplative voice for spiritual and philosophical works.',
    category: 'Spiritual',
    accent: 'British',
    use_cases: ['Spiritual', 'Philosophical', 'Historical'],
    personality: ['Thoughtful', 'Wise', 'Serene'],
    preview_url: 'https://api.elevenlabs.io/v1/voices/callum/preview',
    sampleText: "In the quiet of the monastery garden, Brother Thomas pondered the ancient texts that spoke of wisdom beyond mortal understanding."
  },
  {
    id: 'river',
    name: 'River (The Narrator)',
    gender: 'Neutral',
    language: 'en-US',
    description: 'Versatile and engaging voice suitable for any genre.',
    category: 'General',
    accent: 'Neutral',
    use_cases: ['General Narration', 'Multi-genre'],
    personality: ['Versatile', 'Engaging', 'Adaptive'],
    preview_url: 'https://api.elevenlabs.io/v1/voices/river/preview',
    sampleText: "Stories have a way of finding their own path, like rivers flowing to the sea, carrying us along on currents of imagination."
  },
  {
    id: 'liam',
    name: 'Liam (Prince Alexander)',
    gender: 'Male',
    language: 'en-GB',
    description: 'Young, energetic voice perfect for young adult fiction and adventure stories.',
    category: 'Young Adult',
    accent: 'British',
    use_cases: ['Young Adult', 'Adventure', 'Fantasy'],
    personality: ['Energetic', 'Brave', 'Charismatic'],
    preview_url: 'https://api.elevenlabs.io/v1/voices/liam/preview',
    sampleText: "Prince Alexander gripped his sword tightly, knowing that beyond these castle walls lay adventures that would test not just his courage, but his very soul."
  },
  {
    id: 'charlotte',
    name: 'Charlotte (Lady Victoria)',
    gender: 'Female',
    language: 'en-GB',
    description: 'Elegant and romantic voice for period romances and historical fiction.',
    category: 'Romance',
    accent: 'British',
    use_cases: ['Romance', 'Period Drama', 'Historical'],
    personality: ['Elegant', 'Romantic', 'Refined'],
    preview_url: 'https://api.elevenlabs.io/v1/voices/charlotte/preview',
    sampleText: "Lady Victoria's heart fluttered as she read the letter, each carefully penned word a testament to a love that defied the rigid bounds of society."
  },
  {
    id: 'alice',
    name: 'Alice (Miss Penelope)',
    gender: 'Female',
    language: 'en-GB',
    description: 'Clear and engaging voice for educational content and children\'s literature.',
    category: 'Educational',
    accent: 'British',
    use_cases: ['Educational', 'Children\'s Literature'],
    personality: ['Clear', 'Engaging', 'Warm'],
    preview_url: 'https://api.elevenlabs.io/v1/voices/alice/preview',
    sampleText: "Miss Penelope opened the storybook, and as she began to read, the classroom transformed into a world of wonder and imagination."
  }
];

export const permissionText = `I, [Your Name], hereby grant AudiobookSmith permission to use this voice recording to create an AI voice model for generating audio content based on my manuscript. I understand that this voice sample will be used solely for creating my audiobook and will not be shared with third parties or used for any other commercial purposes without my explicit consent. I confirm that I am the rightful owner of this voice recording and have the authority to grant this permission.`;

export const voiceFeatures = {
  preview: {
    title: "Quick Preview Samples",
    description: "Short character dialogue for quick voice evaluation"
  },
  extended: {
    title: "Extended Samples",
    description: "Longer narrative passages for detailed voice analysis"
  },
  controls: {
    title: "Play/Stop Controls",
    description: "Full audio control with visual feedback"
  },
  integration: {
    title: "ElevenLabs Integration",
    description: "Direct connection to ElevenLabs voice API"
  },
  testing: {
    title: "Multiple Voice Testing",
    description: "Compare different voices seamlessly"
  }
};