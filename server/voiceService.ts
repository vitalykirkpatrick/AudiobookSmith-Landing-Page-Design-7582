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

// Process voices and add avatars and traits
export const VOICES: Voice[] = (voicesData as Voice[]).map((voice, index) => ({
  ...voice,
  avatar: getAvatarUrl(voice.gender, index),
  traits: getTraits(voice.category)
}));

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
