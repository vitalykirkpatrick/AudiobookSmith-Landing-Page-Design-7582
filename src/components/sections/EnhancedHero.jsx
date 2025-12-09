import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import * as HiIcons from 'react-icons/hi';
import * as BsIcons from 'react-icons/bs';
import SafeIcon from '../../common/SafeIcon';

const { FiCheck, FiPlay, FiShield, FiZap, FiHeart, FiClock, FiAward } = FiIcons;
const { HiSparkles } = HiIcons;
const { BsBook, BsMic } = BsIcons;

const EnhancedHero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    {
      icon: FiZap,
      text: "Save thousands: One-time payment, no ongoing fees or royalty splits.",
      highlight: "Save thousands"
    },
    {
      icon: FiShield,
      text: "Zero technical setup: No audio equipment or editing experience needed.",
      highlight: "Zero technical setup"
    },
    {
      icon: HiSparkles,
      text: "Pro-quality results: Advanced AI voices rival human narrators for clarity and consistency.",
      highlight: "Pro-quality results"
    },
    {
      icon: FiClock,
      text: "Fast and easy: Go from manuscript to finished audiobook in just hours, even if you are a first-timer.",
      highlight: "Fast and easy"
    },
    {
      icon: FiHeart,
      text: "Cloud-based convenience: Access your projects anywhere, make edits anytime, and collaborate seamlessly.",
      highlight: "Cloud-based convenience"
    },
    {
      icon: FiAward,
      text: "99.8% satisfaction rate: Delivered within 24hrs with professional quality guarantee.",
      highlight: "99.8% satisfaction rate"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* SEO-optimized background with proper alt text context */}
      <div className="absolute inset-0" role="img" aria-label="Professional audiobook recording studio background">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751855674799-bonkers_image_create_a_realistic%20%281%29.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/50 to-gray-900/60"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* SEO-optimized H1 with target keywords */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="sr-only">AudiobookSmith - </span>
            Why is <strong>making an audiobook</strong> still so{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              expensive, complicated,
            </span>{' '}
            and out of reach for <strong>indie authors</strong>?
          </motion.h1>

          {/* Enhanced audio wave visualization with accessibility */}
          <motion.div 
            className="flex items-center justify-center mb-8 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            role="img"
            aria-label="Audio waveform visualization representing AI voice generation"
          >
            <div className="relative h-24 w-full max-w-md">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-full flex items-center justify-center space-x-1 overflow-hidden">
                  {[...Array(40)].map((_, i) => (
                    <motion.div
                      key={`wave-bar-${i}`}
                      className="w-1.5 bg-gradient-to-t from-primary-400 to-secondary-400 rounded-full"
                      style={{
                        height: `${Math.sin((i + Date.now() / 1000) * 0.5) * 30 + 30}%`,
                        opacity: i % 3 === 0 ? 0.9 : 0.6,
                      }}
                      animate={{
                        height: [
                          `${Math.sin(i * 0.2) * 30 + 20}%`,
                          `${Math.sin(i * 0.2 + Math.PI) * 30 + 20}%`
                        ],
                      }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1 + (i % 4) * 0.2,
                      }}
                    ></motion.div>
                  ))}
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center space-x-6">
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full flex items-center justify-center shadow-lg">
                      <SafeIcon icon={BsMic} className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="mt-1 text-xs font-semibold text-primary-300 text-center">Audio</div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-400 rounded-full flex items-center justify-center shadow-lg">
                      <SafeIcon icon={BsBook} className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="mt-1 text-xs font-semibold text-secondary-300 text-center">book</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SEO-optimized subheadline with semantic markup */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Finally, a <strong className="font-semibold text-primary-300">cloud-based audiobook generator</strong> for{' '}
            <em>independent authors</em>, <em>small publishers</em>, and <em>educators</em> - create{' '}
            <strong>professional audiobooks</strong> in hours, not weeks, without monthly subscriptions or technical headaches.
          </motion.p>

          {/* Benefits with structured data context */}
          <motion.div 
            className="max-w-5xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <SafeIcon icon={benefit.icon} className="w-5 h-5 text-primary-300" aria-hidden="true" />
                  </div>
                  <p className="text-gray-200 leading-relaxed">
                    <strong className="font-semibold text-primary-300">{benefit.highlight}: </strong>
                    {benefit.text.replace(`${benefit.highlight}: `, '')}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Primary CTA with enhanced accessibility */}
          <motion.div 
            className="space-y-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <button
              onClick={() => scrollToSection('features')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-xl"
              aria-label="Watch AudiobookSmith demo and see how AI creates professional audiobooks"
            >
              <SafeIcon icon={FiPlay} className="w-5 h-5 mr-2" aria-hidden="true" />
              See It In Action
            </button>
            <p className="text-sm text-gray-300">
              One-time purchase • No subscriptions • 30-day money-back guarantee
            </p>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
          >
            <Link
              to="/onboarding?plan=free"
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-all transform hover:scale-105"
              aria-label="Start free trial - Create your first audiobook sample with AI"
            >
              Get Started - Create My Audiobook
            </Link>
          </motion.div>

          {/* Trust indicators with semantic markup */}
          <motion.div 
            className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.2 }}
          >
            <div className="flex items-center space-x-2" itemScope itemType="https://schema.org/SecurityPolicy">
              <SafeIcon icon={FiShield} className="w-4 h-4" aria-hidden="true" />
              <span itemProp="name">Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2" itemScope itemType="https://schema.org/ServiceFeature">
              <SafeIcon icon={FiZap} className="w-4 h-4" aria-hidden="true" />
              <span itemProp="name">Fast Processing</span>
            </div>
            <div className="flex items-center space-x-2" itemScope itemType="https://schema.org/WarrantyPromise">
              <SafeIcon icon={FiHeart} className="w-4 h-4" aria-hidden="true" />
              <span itemProp="name">Money-Back Guarantee</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero;