import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPlay, FiPause, FiX } = FiIcons;

const DemoVideo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const audioRefs = useRef({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Enhanced voice samples with real audio URLs
  const voiceSamples = [
    {
      id: 'fiction-sample',
      type: 'Fiction Sample',
      description: 'Perfect for storytelling with emotional depth and character voices',
      sampleText: "The old lighthouse stood silently against the stormy sky, its beacon cutting through the darkness. Sarah clutched the ancient key, knowing that whatever lay beyond that door would change everything. Her heart raced as footsteps echoed behind her.",
      duration: '0:30',
      characteristics: ['Dramatic', 'Engaging', 'Emotional', 'Clear'],
      accent: 'American',
      gender: 'Female',
      bestFor: 'Fiction, Romance, Drama',
      audioUrl: 'https://resource.unmixr.com/sample_audio/f45177b6-db98-479a-b8f7-57a997014d31.mp3',
      category: 'fiction'
    },
    {
      id: 'business-sample',
      type: 'Business Sample',
      description: 'Professional, authoritative voice ideal for business and educational content',
      sampleText: "In today's competitive marketplace, successful companies leverage data-driven insights to make informed decisions. This strategic approach enables sustainable growth, improves operational efficiency, and delivers measurable results that drive long-term profitability.",
      duration: '0:35',
      characteristics: ['Authoritative', 'Professional', 'Clear', 'Confident'],
      accent: 'American',
      gender: 'Male',
      bestFor: 'Business, Educational, Self-Help',
      audioUrl: 'https://resource.unmixr.com/sample_audio/e9d18dad-b28c-4cba-b479-b73c684bc5c8.mp3',
      category: 'business'
    },
    {
      id: 'educational-sample',
      type: 'Educational Sample',
      description: 'Clear, friendly voice perfect for learning and instructional content',
      sampleText: "Photosynthesis is the remarkable process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This fundamental biological process not only sustains plant life but also produces the oxygen that all living creatures depend on for survival.",
      duration: '0:40',
      characteristics: ['Clear', 'Friendly', 'Patient', 'Informative'],
      accent: 'American',
      gender: 'Female',
      bestFor: 'Educational, How-to, Children\'s',
      audioUrl: 'https://resource.unmixr.com/sample_audio/0f2ef8ac-5da9-4400-ad89-dcf8c684f30c.mp3',
      category: 'educational'
    }
  ];

  const playPauseAudio = async (sampleId) => {
    const sample = voiceSamples.find(s => s.id === sampleId);
    if (!sample) return;

    // If currently playing this sample, pause it
    if (currentPlaying === sampleId) {
      const audio = audioRefs.current[sampleId];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setCurrentPlaying(null);
      }
      return;
    }

    // Pause currently playing audio
    if (currentPlaying) {
      const currentAudio = audioRefs.current[currentPlaying];
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }

    // Play the audio
    const audio = audioRefs.current[sampleId];
    if (audio) {
      audio.src = sample.audioUrl;
      try {
        await audio.play();
        setCurrentPlaying(sampleId);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  useEffect(() => {
    // Add event listeners to all audio elements
    Object.keys(audioRefs.current).forEach(sampleId => {
      const audio = audioRefs.current[sampleId];
      if (audio) {
        const handleEnded = () => setCurrentPlaying(null);
        const handleError = () => {
          console.error('Audio playback error for sample:', sampleId);
          setCurrentPlaying(null);
        };
        
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        
        return () => {
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handleError);
        };
      }
    });
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio && !audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

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
            See It In{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Action
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Watch how quickly you can turn your manuscript into a professional audiobook
          </motion.p>
        </div>

        <motion.div
          className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Video Placeholder with Play Button */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary-900/20 to-secondary-900/20"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80)",
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

          {/* Video Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-lg font-semibold">AudiobookSmith Demo (3:42)</div>
            <div className="text-sm text-gray-300">From manuscript to finished audiobook in minutes</div>
          </div>
        </motion.div>

        {/* Enhanced Audio Sample Cards with Real Audio */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {voiceSamples.map((sample, index) => (
            <div key={sample.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold">{sample.type}</h4>
                <span className="text-xs px-2 py-1 bg-primary-500/20 text-primary-300 rounded-full">
                  {sample.duration}
                </span>
              </div>
              
              <p className="text-sm text-gray-400 mb-3">{sample.description}</p>
              
              {/* Sample Text Preview */}
              <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-300 italic">
                  "{sample.sampleText.substring(0, 120)}..."
                </p>
              </div>
              
              {/* Characteristics */}
              <div className="flex flex-wrap gap-1 mb-4">
                {sample.characteristics.map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full"
                  >
                    {char}
                  </span>
                ))}
              </div>

              {/* Voice Details */}
              <div className="text-xs text-gray-500 mb-4 space-y-1">
                <div>Accent: {sample.accent}</div>
                <div>Gender: {sample.gender}</div>
                <div>Best for: {sample.bestFor}</div>
              </div>

              {/* Play Button */}
              <div className="bg-gray-900 rounded-lg p-4 flex items-center space-x-3">
                <button
                  onClick={() => playPauseAudio(sample.id)}
                  className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <SafeIcon 
                    icon={currentPlaying === sample.id ? FiPause : FiPlay} 
                    className="w-5 h-5 text-white" 
                  />
                </button>
                <div className="flex-1">
                  <div className="text-sm font-medium">{sample.type}</div>
                  <div className="text-xs text-gray-400">{sample.duration}</div>
                </div>

                {/* Audio Waveform when playing */}
                {currentPlaying === sample.id && (
                  <div className="flex items-center space-x-1">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary-400 rounded-full"
                        animate={{
                          height: [4, 12, 6, 16, 8, 14, 4],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Hidden Audio Element */}
                <audio
                  ref={el => audioRefs.current[sample.id] = el}
                  preload="none"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Link to Voice Samples Page */}
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
            Explore All Voice Options
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
                {/* Embedded YouTube Video */}
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                  title="AudiobookSmith Demo"
                  frameBorder="0"
                  allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
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