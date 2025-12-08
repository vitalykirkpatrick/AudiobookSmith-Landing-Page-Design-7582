import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import SafeIcon from '../common/SafeIcon';
import ScrollToTop from './ui/ScrollToTop';
import { elevenlabsApi } from '../utils/elevenlabsApi';
import { voiceMetadata, getAvatarUrl } from '../utils/voiceMetadata';

const { FiPlay, FiPause, FiArrowLeft, FiUser, FiGlobe, FiMic, FiFilter, FiCheck, FiStar, FiMail, FiBook } = FiIcons;
const { BsWaveform } = BsIcons;

// Curated list of public domain audiobook samples in native languages
// These represent the "gold standard" of narration that ElevenLabs aims to replicate
const LANGUAGE_SAMPLES = {
  // English (Sherlock Holmes / Classic Literature)
  'English': [
    'https://upload.wikimedia.org/wikipedia/commons/6/6f/Sherlock_Holmes_Selected_Stories_-_01_-_A_Scandal_in_Bohemia.ogg',
    'https://upload.wikimedia.org/wikipedia/commons/c/c2/AmericasLibrary_gov_promo.ogg', 
    'https://upload.wikimedia.org/wikipedia/commons/f/fb/Alice_in_Wonderland_-_01_-_Down_the_Rabbit_Hole.ogg'
  ],
  // Spanish (Don Quixote / Poetry)
  'Spanish': [
    'https://upload.wikimedia.org/wikipedia/commons/8/86/Antonio_Machado_-_Cantares.ogg',
    'https://upload.wikimedia.org/wikipedia/commons/d/da/Es-desayuno.ogg' // Fallback simple
  ],
  // French (Fables / Poetry)
  'French': [
    'https://upload.wikimedia.org/wikipedia/commons/4/4b/Le_Corbeau_et_le_Renard_-_Jean_de_La_Fontaine.ogg',
    'https://upload.wikimedia.org/wikipedia/commons/a/a2/Le_Corbeau_et_le_Renard.ogg'
  ],
  // German (Goethe / Poetry)
  'German': [
    'https://upload.wikimedia.org/wikipedia/commons/f/f3/Goethe_-_Der_Zauberlehrling.ogg',
    'https://upload.wikimedia.org/wikipedia/commons/3/36/Die_Lorelei.ogg'
  ],
  // Italian (Dante)
  'Italian': [
    'https://upload.wikimedia.org/wikipedia/commons/8/80/Dante_Alighieri_-_Inferno_-_Canto_01.ogg',
    'https://upload.wikimedia.org/wikipedia/commons/2/23/Dante_-_Divina_Commedia_-_Inferno_-_Canto_1.ogg'
  ],
  // Portuguese (Literature)
  'Portuguese': [
    'https://upload.wikimedia.org/wikipedia/commons/9/9f/Pt-br-O_Velho_e_o_Mar.ogg', // The Old Man and the Sea snippet
    'https://upload.wikimedia.org/wikipedia/commons/2/2e/Pt-br-O_Velho_e_o_Mar.ogg'
  ],
  // Polish (Mickiewicz)
  'Polish': [
    'https://upload.wikimedia.org/wikipedia/commons/6/64/Pl-Adam_Mickiewicz-Inwokacja.ogg',
    'https://upload.wikimedia.org/wikipedia/commons/a/aec/Pl-Mazurek_Dabrowskiego.ogg'
  ],
  // Japanese (Tale of Genji)
  'Japanese': [
    'https://upload.wikimedia.org/wikipedia/commons/8/8b/Ja-Genji_monogatari-Kiritsubo-1.ogg'
  ],
  // Default fallback for others (Hindi, Arabic, etc. - using high quality English if native not found on Commons)
  'default': [
    'https://upload.wikimedia.org/wikipedia/commons/c/c4/En-us-welcome.ogg'
  ]
};

const getLanguageSample = (language, name) => {
  // Normalize language key
  const langKey = Object.keys(LANGUAGE_SAMPLES).find(k => 
    language.toLowerCase().includes(k.toLowerCase())
  ) || 'default';
  
  const pool = LANGUAGE_SAMPLES[langKey];
  // Deterministic selection based on name length
  const index = name.length % pool.length;
  return pool[index];
};

const VoiceCard = ({ voice, isPlaying, onPlay, onPause }) => {
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePlayPause = async (e) => {
    e.stopPropagation();
    if (!voice.sample_voice_url) return;

    if (isPlaying) {
      onPause();
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      const audioSrc = voice.sample_voice_url;
      if (audioRef.current) {
        // Reset src to ensure fresh load
        audioRef.current.src = "";
        audioRef.current.load();
        
        audioRef.current.src = audioSrc;
        audioRef.current.onloadeddata = () => {
          setIsLoading(false);
          onPlay(voice.uuid, audioRef.current);
        };
        audioRef.current.onerror = (e) => {
          console.error('Audio failed to load:', audioSrc, e);
          // Try fallback if primary fails
          if (audioSrc !== voice.fallback_url && voice.fallback_url) {
             console.log("Retrying with fallback...");
             audioRef.current.src = voice.fallback_url;
             return;
          }
          setIsLoading(false);
          setError(true);
        };
        
        // Timeout safety
        setTimeout(() => {
            if (isLoading) {
                setIsLoading(false);
                setError(true);
            }
        }, 8000);

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Autoplay started!
                setIsLoading(false);
                onPlay(voice.uuid, audioRef.current);
            }).catch(error => {
                // Auto-play was prevented
                console.warn("Playback prevented or failed:", error);
                setIsLoading(false);
            });
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError(true);
      console.error('Audio playback error:', err);
    }
  };

  const getGenderBadgeColor = (gender) => {
    const g = gender.toLowerCase();
    if (g === 'male') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (g === 'female') return 'bg-pink-100 text-pink-800 border-pink-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <audio ref={audioRef} preload="none" crossOrigin="anonymous" />
      <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white blur-xl"></div>
          <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-black blur-xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 overflow-hidden shadow-inner flex-shrink-0">
              <img
                src={voice.avatar_url}
                alt={voice.character}
                className="w-full h-full object-cover transform scale-110 mt-1"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${voice.character}&background=random&color=fff`;
                }}
              />
            </div>
            <div className="text-white">
              <h3 className="font-bold text-xl leading-tight text-white shadow-sm">{voice.character}</h3>
              <p className="text-white/90 text-sm font-medium flex items-center">
                <SafeIcon icon={FiUser} className="w-3 h-3 mr-1" /> {voice.alias}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
          <div className="bg-black/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full border border-white/20 font-medium flex items-center">
            <SafeIcon icon={FiGlobe} className="w-3 h-3 mr-1" /> {voice.language === 'English' ? voice.accent : voice.language}
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full font-bold border ${getGenderBadgeColor(voice.gender)}`}>
            {voice.gender}
          </span>
          {voice.tags && voice.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[10px] uppercase tracking-wide px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-semibold border border-gray-200">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-4 flex-grow pl-1">
          {voice.description}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={handlePlayPause}
            disabled={isLoading || error}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-bold text-sm transition-all w-full shadow-md ${isPlaying ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-[#3b82f6] text-white hover:bg-blue-600'} ${error ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : error ? (
              <>
                <SafeIcon icon={FiMic} className="w-4 h-4" />
                <span>Unavailable</span>
              </>
            ) : isPlaying ? (
              <>
                <SafeIcon icon={FiPause} className="w-4 h-4" />
                <span>Pause Sample</span>
                <div className="flex items-center space-x-0.5 ml-2 h-3">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-current rounded-full"
                      animate={{ height: [4, 12, 6, 10, 4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <SafeIcon icon={FiPlay} className="w-4 h-4" />
                <span>Play Sample</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const VoiceSamplesPage = () => {
  const navigate = useNavigate();
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  // Filters
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedAccent, setSelectedAccent] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');

  useEffect(() => {
    fetchVoices();
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, []);

  const fetchVoices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try fetching from API first
      let data;
      try {
        data = await elevenlabsApi.getVoices();
      } catch (apiError) {
        console.warn("API fetch failed, falling back to comprehensive metadata list:", apiError);
        data = { voices: [] };
      }
      
      let rawVoices = data?.voices || [];
      
      const metadataKeys = Object.keys(voiceMetadata);
      const existingVoiceNames = new Set(rawVoices.map(v => v.name));
      
      // Create mock voice objects for any metadata entry not found in the API
      // This ensures our library is always full, even if the API is restricted
      const missingVoices = metadataKeys.filter(key => !existingVoiceNames.has(key)).map(key => {
        const meta = voiceMetadata[key];
        const language = meta.language || 'English';
        
        // Use a real, native language speech sample
        const fallbackSample = getLanguageSample(language, key);
        
        return {
          voice_id: `mock-${key.toLowerCase()}`,
          name: key,
          preview_url: fallbackSample,
          category: 'premade',
          labels: {} 
        };
      });
      
      // Merge real API voices with our rich metadata-based mock voices
      rawVoices = [...rawVoices, ...missingVoices];

      const formattedVoices = rawVoices.map(voice => {
        const labels = voice.labels || {};
        const meta = voiceMetadata[voice.name] || {};
        
        // Normalize gender
        let genderRaw = meta.gender || labels.gender || 'Neutral';
        const gender = genderRaw.charAt(0).toUpperCase() + genderRaw.slice(1).toLowerCase();
        
        // Normalize accent
        let accentRaw = meta.accent || labels.accent || 'American';
        const accent = accentRaw.replace(/\b\w/g, l => l.toUpperCase());

        // Normalize tags
        let tags = meta.tags;
        if (!tags) {
          const useCase = labels.use_case || 'Narration';
          const useCaseNormalized = useCase.charAt(0).toUpperCase() + useCase.slice(1);
          tags = [useCaseNormalized, accent];
        } else {
          tags = tags.map(t => t.replace(/\b\w/g, l => l.toUpperCase()));
        }

        const language = meta.language || 'English';

        // Determine the best preview URL
        let previewUrl = voice.preview_url;
        // If the API didn't return a preview, assign a language-specific fallback one
        if (!previewUrl) {
            previewUrl = getLanguageSample(language, voice.name);
        }

        return {
          uuid: voice.voice_id,
          character: voice.name,
          alias: meta.alias || "Professional Narrator",
          gender: gender,
          language: language,
          sample_voice_url: previewUrl,
          fallback_url: getLanguageSample(language, voice.name), // Backup URL
          tags: tags,
          description: meta.description || labels.description || `A professional ${accent} voice suitable for audiobooks and clear narration.`,
          avatar_url: getAvatarUrl(voice.name, gender, tags),
          category: voice.category || 'premade',
          accent: accent
        };
      });

      // Filter to show only "premade" or our high-quality mocks
      const standardVoicesOnly = formattedVoices.filter(v => v.category === 'premade');
      standardVoicesOnly.sort((a, b) => a.character.localeCompare(b.character));
      
      setVoices(standardVoicesOnly);
    } catch (err) {
      console.error('Error processing voices:', err);
      setError('Unable to load voice library. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (voiceId, audioElement) => {
    if (currentAudio && currentAudio !== audioElement) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setCurrentlyPlaying(voiceId);
    setCurrentAudio(audioElement);
    
    // Attempt play
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.error('Error playing audio:', err);
        setCurrentlyPlaying(null);
        setCurrentAudio(null);
      });
    }
    
    audioElement.onended = () => {
      setCurrentlyPlaying(null);
      setCurrentAudio(null);
    };
  };

  const handlePause = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setCurrentlyPlaying(null);
    setCurrentAudio(null);
  };

  const handleLogoClick = () => {
    navigate('/');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const handleNavigateWithScroll = (path) => {
    navigate(path);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  // Generate unique filter options
  const genderOptions = [
    { value: 'all', label: 'All Genders' },
    ...Array.from(new Set(voices.map(v => v.gender))).filter(Boolean).sort().map(gender => ({ value: gender, label: gender }))
  ];

  const accentOptions = [
    { value: 'all', label: 'All Accents' },
    ...Array.from(new Set(voices.map(v => v.accent))).filter(Boolean).sort().map(accent => ({ value: accent, label: accent }))
  ];

  const languageOptions = [
    { value: 'all', label: 'All Languages' },
    ...Array.from(new Set(voices.map(v => v.language))).filter(Boolean).sort().map(lang => ({ value: lang, label: lang }))
  ];

  // Extract unique genres from tags
  const allTags = new Set();
  voices.forEach(voice => {
    if (voice.tags && Array.isArray(voice.tags)) {
      voice.tags.forEach(tag => allTags.add(tag));
    }
  });

  // Filter out tags that are likely just accents or redundant to keep the list clean
  const excludedTags = ['American', 'British', 'Australian', 'Male', 'Female', 'Adult', 'Young Adult', 'Older', 'Child', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Korean', 'Russian', 'Chinese', 'Mexican', 'Swedish'];
  
  const genreOptions = [
    { value: 'all', label: 'All Categories' },
    ...Array.from(allTags)
      .filter(tag => !excludedTags.includes(tag))
      .sort()
      .map(tag => ({ value: tag, label: tag }))
  ];

  const filteredVoices = voices.filter(voice => {
    const genderMatch = selectedGender === 'all' || voice.gender === selectedGender;
    const accentMatch = selectedAccent === 'all' || voice.accent === selectedAccent;
    const languageMatch = selectedLanguage === 'all' || voice.language === selectedLanguage;
    const genreMatch = selectedGenre === 'all' || (voice.tags && voice.tags.includes(selectedGenre));
    return genderMatch && accentMatch && languageMatch && genreMatch;
  });

  const stats = [
    { icon: FiUser, value: '1,000+', label: 'Voices Available' },
    { icon: FiGlobe, value: '29', label: 'Languages Supported' },
    { icon: BsWaveform, value: '120+', label: 'Accents & Styles' },
    { icon: FiStar, value: 'Infinite', label: 'Voice Cloning' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={handleLogoClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center relative">
                    <div className="absolute inset-0">
                      <div className="absolute top-1 left-1 w-2 h-0.5 bg-green-400"></div>
                      <div className="absolute top-1 left-1 w-0.5 h-2 bg-green-400"></div>
                      <div className="absolute top-1 right-1 w-2 h-0.5 bg-blue-400"></div>
                      <div className="absolute top-1 right-1 w-0.5 h-2 bg-blue-400"></div>
                      <div className="absolute bottom-1 left-1 w-2 h-0.5 bg-yellow-400"></div>
                      <div className="absolute bottom-1 left-1 w-0.5 h-2 bg-yellow-400"></div>
                      <div className="absolute bottom-1 right-1 w-2 h-0.5 bg-purple-400"></div>
                      <div className="absolute bottom-1 right-1 w-0.5 h-2 bg-purple-400"></div>
                    </div>
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-[10px] font-extrabold text-primary-600">AS</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary-600">Audio</span>
                <span className="text-secondary-600">book</span>
                <span className="text-primary-600">Smith</span>
              </span>
            </button>
            <div className="flex items-center space-x-4">
              <button onClick={handleLogoClick} className="hidden md:inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors">
                <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" /> Back to Home
              </button>
              <button onClick={() => handleNavigateWithScroll('/#transform-form')} className="inline-flex items-center px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md font-medium">
                <SafeIcon icon={FiPlay} className="w-4 h-4 mr-2" /> Start Creating
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern AI Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 border-b border-gray-800 py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e1b4b]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <SafeIcon icon={BsWaveform} className="w-4 h-4 mr-2" /> Premium AI Voice Technology
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Standard <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Studio Voices</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Explore our curated collection of industry-leading AI voices. Each voice is uniquely crafted to deliver professional, emotionally resonant narration for any genre or project.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-gray-400 bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl inline-flex border border-white/10 shadow-2xl">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center px-4">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-gray-700 font-medium">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-[#3b82f6]" />
              <span>Filter Library:</span>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              {/* Language Filter */}
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:bg-gray-100 flex-1 md:flex-none shadow-sm min-w-[130px]"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              {/* Gender Filter */}
              <select 
                value={selectedGender} 
                onChange={(e) => setSelectedGender(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:bg-gray-100 flex-1 md:flex-none shadow-sm min-w-[130px]"
              >
                {genderOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              {/* Accent Filter */}
              <select 
                value={selectedAccent} 
                onChange={(e) => setSelectedAccent(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:bg-gray-100 flex-1 md:flex-none shadow-sm min-w-[130px]"
              >
                {accentOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              {/* Genre/Category Filter */}
              <select 
                value={selectedGenre} 
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:bg-gray-100 flex-1 md:flex-none shadow-sm min-w-[160px]"
              >
                {genreOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center text-sm text-gray-500 ml-auto md:ml-0 bg-gray-100 px-3 py-1.5 rounded-full">
              <SafeIcon icon={FiCheck} className="w-4 h-4 mr-1.5 text-green-500" />
              <span className="font-semibold text-gray-900 mr-1">{filteredVoices.length}</span> voices available
            </div>
          </div>
        </div>
      </div>

      {/* Voice Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium animate-pulse">Loading standard voice library...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiMic} className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Library Unavailable</h3>
              <p className="text-gray-500 mb-6 px-6">{error}</p>
              <button onClick={fetchVoices} className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md">
                Retry Connection
              </button>
            </div>
          ) : filteredVoices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
              <SafeIcon icon={FiFilter} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No voices match your filters</h3>
              <p className="text-gray-500 mb-4">Try adjusting your genre, gender, or accent selection.</p>
              <button 
                onClick={() => {
                  setSelectedGender('all');
                  setSelectedAccent('all');
                  setSelectedGenre('all');
                  setSelectedLanguage('all');
                }}
                className="text-[#3b82f6] font-medium hover:text-blue-700 underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredVoices.map((voice) => (
                <VoiceCard 
                  key={voice.uuid} 
                  voice={voice} 
                  isPlaying={currentlyPlaying === voice.uuid}
                  onPlay={handlePlay}
                  onPause={handlePause}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Create Your Audiobook?
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Start with a free sample using any of these premium voices. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => handleNavigateWithScroll('/#transform-form')} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
                <SafeIcon icon={FiMic} className="w-5 h-5 mr-3" /> Start Free Sample
              </button>
              <button onClick={() => handleNavigateWithScroll('/voice-cloning')} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all hover:-translate-y-1">
                <SafeIcon icon={FiUser} className="w-5 h-5 mr-3" /> Clone My Voice
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <ScrollToTop />

      {/* Standardized Bottom Footer */}
      <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Left: Logo + Copyright */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AS</span>
                </div>
                <span className="text-lg font-bold text-white hidden sm:block">AudiobookSmith</span>
              </div>
              <div className="h-4 w-px bg-gray-700 hidden sm:block"></div>
              <div className="text-sm text-gray-500">
                © 2024 All rights reserved.
              </div>
            </div>

            {/* Right: Legal Links */}
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors" onClick={() => window.scrollTo(0,0)}>Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors" onClick={() => window.scrollTo(0,0)}>Terms of Service</Link>
              <Link to="/cookies" className="text-sm text-gray-500 hover:text-white transition-colors" onClick={() => window.scrollTo(0,0)}>Cookies Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VoiceSamplesPage;