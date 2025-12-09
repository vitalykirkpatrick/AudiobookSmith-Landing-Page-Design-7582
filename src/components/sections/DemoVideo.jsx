import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { getVoiceSample } from '../../utils/voiceGenerator';
import { voiceMetadata, getAvatarUrl } from '../../utils/voiceMetadata';

// Import icons safely
const { FiPlay, FiPause, FiX, FiUser, FiLoader, FiClock } = FiIcons;

const DemoVideo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const audioRefs = useRef({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Define our curated voices for the demo section
  // These specific IDs correspond to high-quality ElevenLabs voices
  const DEMO_VOICES = [
    {
      id: '21m00Tcm4TlvDq8ikWAM', // Rachel
      name: 'Rachel',
      category: 'Narration',
      sampleText: "AudiobookSmith transforms your manuscript into a professional audiobook in minutes, not weeks."
    },
    {
      id: 'ErXwobaYiN019PkySvjV', // Antoni
      name: 'Antoni',
      category: 'Business',
      sampleText: "With our advanced AI technology, you retain 100% of your royalties and creative control."
    },
    {
      id: 'TxGEqnHWrfWFTfGW9XjX', // Josh
      name: 'Josh',
      category: 'Storytelling',
      sampleText: "Experience the depth and emotion of human-like narration, perfect for bringing your characters to life."
    }
  ];

  // Initialize and load voices
  useEffect(() => {
    const loadVoices = async () => {
      setLoading(true);
      const loadedVoices = [];
      
      for (const demoVoice of DEMO_VOICES) {
        // Get metadata for display
        const meta = voiceMetadata[demoVoice.name] || {};
        const gender = meta.gender || 'Neutral';
        const accent = meta.accent || 'American';
        const tags = meta.tags || ['Professional'];
        const description = meta.description || 'Professional AI narrator suitable for various content types.';

        // Use our S3-pattern generator to get/create the audio URL
        // This handles the "Generate Once, Store, Retrieve" logic
        const audioUrl = await getVoiceSample(demoVoice.id, demoVoice.sampleText);
        
        loadedVoices.push({
          ...demoVoice,
          description,
          gender,
          accent,
          avatarUrl: getAvatarUrl(demoVoice.name, gender, tags),
          tags: tags,
          previewUrl: audioUrl // This is now our persistent URL
        });
      }
      
      setVoices(loadedVoices);
      setLoading(false);
    };

    loadVoices();
  }, []);

  const playPauseAudio = async (voiceId, previewUrl) => {
    if (!previewUrl) return;

    // Pause currently playing if different
    if (currentPlaying && currentPlaying !== voiceId) {
      const currentAudio = audioRefs.current[currentPlaying];
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      setCurrentPlaying(null);
    }

    const audio = audioRefs.current[voiceId];
    if (audio) {
      if (currentPlaying === voiceId) {
        // Pause if already playing
        audio.pause();
        setCurrentPlaying(null);
      } else {
        // Play new audio
        if (!audio.src) audio.src = previewUrl;
        try {
          await audio.play();
          setCurrentPlaying(voiceId);
        } catch (error) {
          console.error('Playback error:', error);
        }
      }
    }
  };

  // Handle audio events
  useEffect(() => {
    Object.keys(audioRefs.current).forEach(id => {
      const audio = audioRefs.current[id];
      if (audio) {
        const handleEnded = () => {
          setCurrentPlaying(null);
          audio.currentTime = 0;
        };
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
      }
    });
  }, [voices]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            See It In <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Action</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the quality of our AI-generated voices directly
          </motion.p>
        </div>

        {/* Video Placeholder */}
        <motion.div 
          className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-r from-primary-900/20 to-secondary-900/20"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <button 
              onClick={openModal}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all group"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <SafeIcon icon={FiPlay} className="w-8 h-8 text-primary-600 ml-1" />
              </div>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-lg font-semibold">AudiobookSmith Demo (3:42)</div>
            <div className="text-sm text-gray-300">From manuscript to finished audiobook in minutes</div>
          </div>
        </motion.div>

        {/* Custom Voices Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-2">Custom Generated Voices</h3>
            <p className="text-gray-400">Listen to samples generated instantly with our engine</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <SafeIcon icon={FiLoader} className="animate-spin w-8 h-8 text-white mr-3" />
              <span className="text-gray-400">Generating samples...</span>
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {voices.map((voice) => (
                <div key={voice.id} className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all flex flex-col h-full group hover:shadow-xl hover:shadow-primary-900/20">
                  
                  {/* Header: Title + Duration */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xl font-bold text-white">{voice.category} Sample</h4>
                      <p className="text-sm text-gray-400 font-medium">{voice.name}</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-gray-700/50 text-xs font-mono text-primary-300 border border-gray-600 flex items-center">
                      0:15
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed h-10">
                    {voice.description}
                  </p>

                  {/* Sample Text Box */}
                  <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-700/50 mb-5 relative overflow-hidden group-hover:border-primary-500/30 transition-colors flex-grow">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-secondary-500 opacity-70"></div>
                    <p className="text-sm text-gray-300 italic leading-relaxed font-medium">
                      "{voice.sampleText}"
                    </p>
                  </div>

                  {/* Tags Pills */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {voice.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full border border-gray-600/50 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Metadata List */}
                  <div className="space-y-1.5 mb-6 text-sm">
                    <div className="flex items-center">
                      <span className="w-20 text-gray-500 font-medium">Accent:</span>
                      <span className="text-gray-300">{voice.accent}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-gray-500 font-medium">Gender:</span>
                      <span className="text-gray-300">{voice.gender}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20 text-gray-500 font-medium">Best for:</span>
                      <span className="text-gray-300 truncate">{voice.tags.join(', ')}</span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => playPauseAudio(voice.id, voice.previewUrl)}
                      className={`w-full h-14 rounded-xl flex items-center px-4 transition-all duration-300 ${
                        currentPlaying === voice.id 
                          ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-900/30' 
                          : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-900/30 hover:shadow-primary-900/50 hover:scale-[1.02]'
                      }`}
                    >
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0 backdrop-blur-sm">
                        <SafeIcon icon={currentPlaying === voice.id ? FiPause : FiPlay} className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-grow text-left">
                        <span className="block font-bold text-sm">
                          {currentPlaying === voice.id ? 'Pause Sample' : `Play ${voice.category} Sample`}
                        </span>
                        <span className="block text-xs opacity-80 font-medium">
                          {currentPlaying === voice.id ? 'Playing...' : '0:15 • High Quality'}
                        </span>
                      </div>
                      {currentPlaying === voice.id && (
                        <div className="flex items-center space-x-0.5 h-4 ml-2">
                          {[...Array(4)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-white/80 rounded-full"
                              animate={{ height: [4, 16, 8, 12, 4] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                    <audio 
                      ref={el => audioRefs.current[voice.id] = el}
                      src={voice.previewUrl} 
                      preload="none" 
                      crossOrigin="anonymous" 
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Updated Button Text as requested */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link 
            to="/voice-samples" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <SafeIcon icon={FiPlay} className="w-5 h-5 mr-2" />
            Explore Voices
          </Link>
          <p className="text-sm text-gray-400 mt-2">
            Professional AI voices for every genre
          </p>
        </motion.div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl">
              <button 
                onClick={closeModal}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1" 
                  title="AudiobookSmith Demo" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DemoVideo;