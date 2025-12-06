import voicesData from './voices-data.json';

export interface Voice {
  id: string;
  category: string;
  character: string;
  elevenlabs_voice_id: string;
  elevenlabs_name: string;
  gender: string;
  age: string;
  accent: string;
  language: string;
  preview_url: string;
  description: string;
  descriptive: string;
  use_case: string;
  avatar?: string;
  traits?: string[];
  useCaseTags?: string[];
  languageCode?: string;
}

// Avatar URLs (human faces from Unsplash)
const AVATAR_URLS = {
  male: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1553514029-1318c9127859?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop&crop=face',
  ],
  female: [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face',
  ],
  neutral: [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face',
  ]
};

function getAvatarUrl(gender: string, index: number): string {
  const genderLower = gender.toLowerCase();
  if (genderLower in AVATAR_URLS) {
    const avatars = AVATAR_URLS[genderLower as keyof typeof AVATAR_URLS];
    return avatars[index % avatars.length];
  }
  return AVATAR_URLS.neutral[0];
}

// Map categories to use case tags (Fiction, Adventure, Crime, etc.)
const USE_CASE_TAGS_MAP: Record<string, string[]> = {
  'adventurer': ['Adventure', 'Action', 'Epic Fantasy'],
  'audiobook-narrator': ['Audiobook', 'Narration', 'Professional'],
  'booming': ['Epic Fantasy', 'Military', 'Heroic'],
  'dark': ['Fiction', 'Mystery', 'Dramatic'],
  'documentary-narrator': ['Non-Fiction', 'Documentary', 'Educational'],
  'dramatic': ['Dramatic', 'Fiction', 'Narration'],
  'emotional': ['Romance', 'Fiction', 'Emotional'],
  'expressive': ['Fiction', 'Audiobook', 'Versatile'],
  'fantasy': ['Fantasy', 'Epic Fantasy', 'Fiction'],
  'father': ['Fiction', 'Audiobook', 'Calm'],
  'gentle': ['Meditation', 'Calm', 'Soothing'],
  'grandfather': ['Fiction', 'Audiobook', 'Narration'],
  'grandmother': ['Fiction', 'Audiobook', 'Narration'],
  'gravelly': ['Action', 'Crime', 'Thriller'],
  'horror': ['Horror', 'Thriller', 'Suspense'],
  'intense': ['Thriller', 'Crime', 'Action'],
  'mature': ['Fiction', 'Audiobook', 'Professional'],
  'measured': ['Non-Fiction', 'Professional', 'Audiobook'],
  'mentor': ['Fiction', 'Fantasy', 'Audiobook'],
  'monotone': ['Non-Fiction', 'Technical', 'Professional'],
  'mother': ['Fiction', 'Audiobook', 'Narration'],
  'mysterious': ['Mystery', 'Thriller', 'Fiction'],
  'mystery': ['Mystery', 'Crime', 'Thriller'],
  'narrator': ['Audiobook', 'Narration', 'Fiction'],
  'poem': ['Poetry', 'Fiction', 'Audiobook'],
  'poetic': ['Poetry', 'Fiction', 'Romance'],
  'preacher': ['Audiobook', 'Narration', 'Fiction'],
  'priest': ['Audiobook', 'Narration', 'Fiction'],
  'professional-narrator': ['Audiobook', 'Professional', 'Narration'],
  'resonant': ['Audiobook', 'Professional', 'Narration'],
  'romantic': ['Romance', 'Fiction', 'Dramatic'],
  'soothing': ['Meditation', 'Calm', 'Audiobook'],
  'storyteller': ['Fiction', 'Audiobook', 'Narration'],
  'suspense': ['Suspense', 'Thriller', 'Mystery'],
  'terror': ['Horror', 'Thriller', 'Suspense'],
  'velvety': ['Audiobook', 'Smooth', 'Professional'],
  'warm': ['Fiction', 'Audiobook', 'Calm']
};

const TRAITS_MAP: Record<string, string[]> = {
  'adventurer': ['Bold', 'Daring', 'Confident'],
  'audiobook-narrator': ['Professional', 'Clear', 'Engaging'],
  'booming': ['Powerful', 'Commanding', 'Heroic'],
  'dark': ['Mysterious', 'Dark', 'Haunting'],
  'documentary-narrator': ['Informative', 'Engaging', 'Trustworthy'],
  'dramatic': ['Dramatic', 'Passionate', 'Emotional'],
  'emotional': ['Emotional', 'Warm', 'Heartfelt'],
  'expressive': ['Expressive', 'Versatile', 'Engaging'],
  'fantasy': ['Mystical', 'Wise', 'Magical'],
  'father': ['Paternal', 'Caring', 'Protective'],
  'gentle': ['Gentle', 'Soothing', 'Caring'],
  'grandfather': ['Wise', 'Warm', 'Nostalgic'],
  'grandmother': ['Nurturing', 'Wise', 'Comforting'],
  'gravelly': ['Rough', 'Tough', 'Gritty'],
  'horror': ['Terrifying', 'Ominous', 'Chilling'],
  'intense': ['Intense', 'Sharp', 'Focused'],
  'mature': ['Mature', 'Sophisticated', 'Refined'],
  'measured': ['Measured', 'Precise', 'Authoritative'],
  'mentor': ['Wise', 'Guiding', 'Enlightened'],
  'monotone': ['Precise', 'Clinical', 'Methodical'],
  'mother': ['Nurturing', 'Loving', 'Protective'],
  'mysterious': ['Mysterious', 'Enigmatic', 'Intriguing'],
  'mystery': ['Analytical', 'Deductive', 'Sharp'],
  'narrator': ['Versatile', 'Engaging', 'Adaptive'],
  'poem': ['Lyrical', 'Artistic', 'Flowing'],
  'poetic': ['Poetic', 'Dreamy', 'Ethereal'],
  'princess': ['Elegant', 'Graceful', 'Refined'],
  'raspy': ['Raspy', 'Textured', 'Distinctive'],
  'romantic': ['Romantic', 'Passionate', 'Elegant'],
  'smooth': ['Smooth', 'Silky', 'Polished'],
  'soft': ['Soft', 'Gentle', 'Delicate'],
  'storyteller': ['Storytelling', 'Warm', 'Traditional'],
  'suspense': ['Suspenseful', 'Tense', 'Gripping'],
  'terror': ['Terrifying', 'Frightening', 'Intense'],
  'velvety': ['Smooth', 'Rich', 'Luxurious'],
  'warm': ['Warm', 'Friendly', 'Inviting']
};

function getTraits(category: string): string[] {
  return TRAITS_MAP[category] || ['Versatile', 'Professional', 'Engaging'];
}

function getUseCaseTags(category: string): string[] {
  return USE_CASE_TAGS_MAP[category] || ['Audiobook', 'Narration', 'Fiction'];
}

function getLanguageCode(language: string): string {
  // Map language to display format
  const languageMap: Record<string, string> = {
    'en-US': 'English (US)',
    'en-GB': 'English (UK)',
    'en': 'English (US)'
  };
  return languageMap[language] || 'English (US)';
}

// Process voices and add avatars, traits, use case tags, and language codes
let maleIndex = 0;
let femaleIndex = 0;

export const VOICES: Voice[] = (voicesData as Voice[]).map((voice) => {
  // Ensure avatar matches gender
  const genderLower = voice.gender.toLowerCase();
  let avatar: string;
  
  if (genderLower === 'male') {
    avatar = AVATAR_URLS.male[maleIndex % AVATAR_URLS.male.length];
    maleIndex++;
  } else if (genderLower === 'female') {
    avatar = AVATAR_URLS.female[femaleIndex % AVATAR_URLS.female.length];
    femaleIndex++;
  } else {
    avatar = AVATAR_URLS.neutral[0];
  }
  
  return {
    ...voice,
    avatar,
    traits: getTraits(voice.category),
    useCaseTags: getUseCaseTags(voice.category),
    languageCode: getLanguageCode(voice.language)
  };
});

export function getAllVoices(): Voice[] {
  return VOICES;
}

export function getVoiceById(id: string): Voice | undefined {
  return VOICES.find(v => v.id === id);
}

export function filterVoices(gender?: string, category?: string): Voice[] {
  let filtered = VOICES;
  
  if (gender && gender !== 'all') {
    filtered = filtered.filter(v => v.gender.toLowerCase() === gender.toLowerCase());
  }
  
  if (category && category !== 'all') {
    filtered = filtered.filter(v => v.category === category);
  }
  
  return filtered;
}

export function getCategories(): string[] {
  const categories = new Set(VOICES.map(v => v.category));
  return Array.from(categories).sort();
}

export function getStatistics() {
  const languages = new Set(VOICES.map(v => v.language));
  const accents = new Set(VOICES.map(v => v.accent));
  const genders = new Set(VOICES.map(v => v.gender));
  
  return {
    totalVoices: VOICES.length,
    languages: Array.from(languages),
    accents: Array.from(accents),
    genders: Array.from(genders),
    languageCount: languages.size,
    accentCount: accents.size
  };
}
