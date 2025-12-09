import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPlay, FiX } = FiIcons;

const StickyButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past the hero section
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    // Scroll to transform form section
    const formSection = document.getElementById('transform-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback to top if form section doesn't exist
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 hidden" // Hidden on all devices
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={handleClick}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-full shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105"
          >
            <SafeIcon icon={FiPlay} className="w-5 h-5 mr-2" />
            Create My Audiobook
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyButton;