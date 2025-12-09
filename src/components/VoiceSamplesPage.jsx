import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import SafeIcon from '../common/SafeIcon';
import ScrollToTop from './ui/ScrollToTop';
import { elevenlabsApi } from '../utils/elevenlabsApi';
import { voiceMetadata, getAvatarUrl } from '../utils/voiceMetadata';

const { FiPlay, FiPause, FiArrowLeft, FiUser, FiGlobe, FiMic, FiFilter, FiCheck, FiStar } = FiIcons;
const { BsWaveform } = BsIcons;

// Official ElevenLabs Premade Voices Fallback List
// Used only if the API fails or returns no data, ensuring we show real ElevenLabs samples.
const FALLBACK_ELEVENLABS_VOICES = [
  {
    voice_id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/68434778-3603-4672-b546-aa4e23364230.mp3",
    category: "premade"
  },
  {
    voice_id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/df6788f9-5c96-470d-8312-a63b3eb42500.mp3",
    category: "premade"
  },
  {
    voice_id: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/ErXwobaYiN019PkySvjV/38d6345e-99e0-466d-921c-4b630c72e2db.mp3",
    category: "premade"
  },
  {
    voice_id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh",
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/TxGEqnHWrfWFTfGW9XjX/3e0b0e52-320d-4f47-a92e-365287752697.mp3",
    category: "premade"
  },
  {
    voice_id: "VR6AewLTigWg4xSOukaG",
    name: "Arnold",
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/VR6AewLTigWg4xSOukaG/16d3e69f-3d12-424d-a517-910f443b81c2.mp3",
    category: "premade"
  },
  {
    voice_id: "yoZ06aMxZJJ28mfd3POQ",
    name: "Sam",
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/yoZ06aMxZJJ28mfd3POQ/1c4d417c-4403-455f-8611-305140d34800.mp3",
    category: "premade"
  },
  {
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/00045432-843e-42c2-bb53-43574730702d.mp3",
    category: "premade"
  },
  {
    voice_id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/AZnzlk1XvdvUeBnXmlld/507e1279-566b-4e08-9d75-9c5950585640.mp3",
    category: "premade"
  },
  {
    voice_id: "MF3mGyEYCl7XYWbV9V6O",
    name: "Elli",
    preview_url: "https://storage.googleapis.com/eleven-public-prod/premade/voices/MF3mGyEYCl7XYWbV9V6O/d9ff78ba-d01c-47f6-b0ef-dd41e3cdf6d4.mp3",
    category: "premade"
  }
];

const VoiceCard = ({ voice, isPlaying, onPlay, onPause }) => {
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    setIsLoading(false);
  }, [voice.sample_voice_url]);

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
      if (audioRef.current) {
        audioRef.current.src = voice.sample_voice_url;
        audioRef.current.onloadeddata = () => {
          setIsLoading(false);
          onPlay(voice.uuid, audioRef.current);
        };
        audioRef.current.onerror = (e) => {
          console.error('Audio failed to load:', voice.sample_voice_url, e);
          setIsLoading(false);
          setError(true);
        };
        audioRef.current.load();
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
            <SafeIcon icon={FiGlobe} className="w-3 h-3 mr-1" /> {voice.language}
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
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-bold text-sm transition-all w-full shadow-md ${
              isPlaying 
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                : 'bg-[#3b82f6] text-white hover:bg-blue-600'
            } ${error ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : ''}`}
            title={error ? "Sample currently unavailable" : ""}
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
      
      let rawVoices = [];
      
      // 1. Try fetching from API
      try {
        const data = await elevenlabsApi.getVoices();
        if (data && data.voices && data.voices.length > 0) {
          rawVoices = data.voices;
        }
      } catch (apiError) {
        console.warn("API fetch failed, falling back to offline list");
      }

      // 2. If API failed or returned empty list, use AUTHENTIC fallback list
      // We do NOT inject unmixr samples anymore.
      if (rawVoices.length === 0) {
        rawVoices = FALLBACK_ELEVENLABS_VOICES;
      }

      const formattedVoices = rawVoices.map(voice => {
        const labels = voice.labels || {};
        const meta = voiceMetadata[voice.name] || {};
        
        // Normalize gender
        let genderRaw = meta.gender || labels.gender || 'Neutral';
        const gender = genderRaw.charAt(0).toUpperCase() + genderRaw.slice(1).toLowerCase();
        
        // Normalize accent
        let accentRaw = meta.accent || labels.accent || 'American';
        const accent = accentRaw.replace(/\b\w/g, l => l.toUpperCase());
        
        // Use Language from metadata, default to English
        const language = meta.language || 'English';

        // Normalize tags
        let tags = meta.tags;
        if (!tags) {
          const useCase = labels.use_case || 'Narration';
          const useCaseNormalized = useCase.charAt(0).toUpperCase() + useCase.slice(1);
          tags = [useCaseNormalized, accent];
        } else {
          tags = tags.map(t => t.replace(/\b\w/g, l => l.toUpperCase()));
        }

        return {
          uuid: voice.voice_id,
          character: voice.name,
          alias: meta.alias || "Professional Narrator",
          gender: gender,
          language: language,
          sample_voice_url: voice.preview_url, // STRICTLY use the source URL
          tags: tags,
          description: meta.description || labels.description || `A professional ${accent} voice suitable for audiobooks and clear narration.`,
          avatar_url: getAvatarUrl(voice.name, gender, tags),
          category: voice.category || 'premade', 
          accent: accent
        };
      });

      // Filter to show only "premade" (Standard ElevenLabs voices)
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
    audioElement.play().catch(err => {
      console.error('Error playing audio:', err);
      setCurrentlyPlaying(null);
      setCurrentAudio(null);
    });
    
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

  const languageOptions = [
    { value: 'all', label: 'All Languages' },
    ...Array.from(new Set(voices.map(v => v.language))).filter(Boolean).sort().map(lang => ({ value: lang, label: lang }))
  ];

  const allTags = new Set();
  voices.forEach(voice => {
    if (voice.tags && Array.isArray(voice.tags)) {
      voice.tags.forEach(tag => allTags.add(tag));
    }
  });
  
  const excludedTags = ['American', 'British', 'Australian', 'Male', 'Female', 'Adult', 'Young Adult', 'Older', 'Child'];
  const genreOptions = [
    { value: 'all', label: 'All Categories' },
    ...Array.from(allTags)
      .filter(tag => !excludedTags.includes(tag))
      .sort()
      .map(tag => ({ value: tag, label: tag }))
  ];

  const filteredVoices = voices.filter(voice => {
    const genderMatch = selectedGender === 'all' || voice.gender === selectedGender;
    const languageMatch = selectedLanguage === 'all' || voice.language === selectedLanguage;
    const genreMatch = selectedGenre === 'all' || (voice.tags && voice.tags.includes(selectedGenre));
    return genderMatch && languageMatch && genreMatch;
  });

  const stats = [
    { icon: FiUser, value: '1,000+', label: 'Voices Available' },
    { icon: FiGlobe, value: '32', label: 'Languages Supported' },
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
              <button 
                onClick={handleLogoClick}
                className="hidden md:inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" /> Back to Home
              </button>
              <button 
                onClick={() => handleNavigateWithScroll('/#transform-form')}
                className="inline-flex items-center px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md font-medium"
              >
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
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
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
              <button 
                onClick={fetchVoices}
                className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md"
              >
                Retry Connection
              </button>
            </div>
          ) : filteredVoices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
              <SafeIcon icon={FiFilter} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No voices match your filters</h3>
              <p className="text-gray-500 mb-4">Try adjusting your genre, gender, or language selection.</p>
              <button 
                onClick={() => {
                  setSelectedGender('all');
                  setSelectedLanguage('all');
                  setSelectedGenre('all');
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Create Your Audiobook?
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Start with a free sample using any of these premium voices. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => handleNavigateWithScroll('/#transform-form')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <SafeIcon icon={FiMic} className="w-5 h-5 mr-3" />
                Start Free Sample
              </button>
              <button 
                onClick={() => handleNavigateWithScroll('/voice-cloning')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all hover:-translate-y-1"
              >
                <SafeIcon icon={FiUser} className="w-5 h-5 mr-3" />
                Clone My Voice
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
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Terms of Service</Link>
              <Link to="/cookies" className="text-sm text-gray-500 hover:text-white transition-colors" onClick={() => window.scrollTo(0, 0)}>Cookies Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VoiceSamplesPage;