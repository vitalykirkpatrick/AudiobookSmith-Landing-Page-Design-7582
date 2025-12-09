import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SEOHead from './SEOHead';
import Hero from './sections/Hero';
import PainPoints from './sections/PainPoints';
import DesiredOutcome from './sections/DesiredOutcome';
import ProductIntro from './sections/ProductIntro';
import DemoVideo from './sections/DemoVideo';
import ProductShowcase from './sections/ProductShowcase';
import Testimonials from './sections/Testimonials';
import TransformForm from './sections/TransformForm';
import FAQ from './sections/FAQ';
import Pricing from './sections/Pricing';
import StickyButton from './ui/StickyButton';
import ScrollToTop from './ui/ScrollToTop';
import Footer from './sections/Footer';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiUser, FiLogIn, FiVolume2, FiMenu, FiX } = FiIcons;
const { BsBook, BsSoundwave } = BsIcons;

const SEOOptimizedLandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.8]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes or on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false); // Close mobile menu
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateWithScroll = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // SEO-optimized structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://audiobooksmith.com/#organization",
        "name": "AudiobookSmith",
        "url": "https://audiobooksmith.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://audiobooksmith.com/logo.png",
          "width": 300,
          "height": 100
        },
        "description": "AI-powered audiobook generation platform for independent authors, educators, and publishers",
        "founder": {
          "@type": "Person",
          "name": "Vitaly Kirkpatrick",
          "jobTitle": "Founder & CEO"
        },
        "foundingDate": "2024",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-800-AUDIOBOOK",
          "contactType": "customer service",
          "email": "support@audiobooksmith.com",
          "availableLanguage": "English"
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US",
          "addressRegion": "CA"
        },
        "sameAs": [
          "https://twitter.com/audiobooksmith",
          "https://linkedin.com/company/audiobooksmith",
          "https://facebook.com/audiobooksmith"
        ]
      }
    ]
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* SEO Head Component */}
        <SEOHead 
          title="AudiobookSmith - AI Audiobook Generator for Authors & Publishers | No Subscriptions"
          description="Create professional audiobooks with AI in hours, not weeks. Perfect for indie authors, educators & self-publishers. One-time payment, keep 100% royalties. Free sample available."
          keywords="ai audiobook generator, text to speech audiobook, audiobook creation tool, self-publishing audiobooks, indie authors, audiobook software for authors, convert book to audiobook software, affordable audiobook production, no subscription audiobook software, ai narration for self-publishers, secure audiobook generation, batch audiobook processing tool"
          canonicalUrl="https://audiobooksmith.com"
          structuredData={homepageStructuredData}
        />

        {/* Navigation with SEO-optimized structure */}
        <motion.nav 
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
          style={{ opacity }}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button onClick={handleLogoClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity" aria-label="AudiobookSmith - AI Audiobook Generator Homepage">
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
              </motion.div>

              {/* Desktop Navigation */}
              <motion.div 
                className="hidden md:flex items-center space-x-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <button onClick={() => scrollToSection('product-showcase')} className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer" aria-label="View AudiobookSmith features">
                  Features
                </button>
                <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer" aria-label="Learn how AudiobookSmith works">
                  How It Works
                </button>
                <button onClick={() => handleNavigateWithScroll('/voice-samples')} className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer" aria-label="Listen to voice samples and demos">
                  Voices Demo
                </button>
                <button onClick={() => handleNavigateWithScroll('/pricing')} className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer" aria-label="View AudiobookSmith pricing plans">
                  Pricing
                </button>
                <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer" aria-label="Frequently asked questions about AI audiobook creation">
                  FAQ
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer" aria-label="Contact AudiobookSmith support">
                  Contact
                </button>
                <button onClick={() => handleNavigateWithScroll('/login')} className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors" title="Login to your AudiobookSmith account" aria-label="Login to your AudiobookSmith account">
                  <SafeIcon icon={FiUser} className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleNavigateWithScroll('/signup')} 
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg"
                  aria-label="Create your AudiobookSmith account"
                >
                  <SafeIcon icon={FiPlay} className="w-4 h-4 mr-2" /> Get Started
                </button>
              </motion.div>

              {/* Mobile Navigation */}
              <div className="md:hidden flex items-center">
                <button onClick={toggleMobileMenu} className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Toggle mobile menu">
                  <SafeIcon icon={isMobileMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div 
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                {/* Mobile Menu */}
                <motion.div 
                  className="fixed top-16 right-0 w-80 max-w-[90vw] bg-white shadow-2xl z-50 md:hidden border-l border-gray-200"
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                >
                  <div className="p-6 h-screen overflow-y-auto">
                    {/* Get Started - Highlighted */}
                    <motion.button 
                      onClick={() => handleNavigateWithScroll('/signup')}
                      className="w-full mb-6 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <SafeIcon icon={FiPlay} className="w-5 h-5 mr-2" /> Get Started Free
                    </motion.button>

                    {/* Navigation Links */}
                    <nav className="space-y-2">
                      <MobileNavLink onClick={() => scrollToSection('product-showcase')} icon={BsBook} label="Features" description="Explore our powerful tools" />
                      <MobileNavLink onClick={() => scrollToSection('features')} icon={FiPlay} label="How It Works" description="See our simple process" />
                      <MobileNavLink onClick={() => handleNavigateWithScroll('/voice-samples')} icon={FiVolume2} label="Voice Samples" description="Listen to AI voices" />
                      <MobileNavLink onClick={() => handleNavigateWithScroll('/pricing')} icon={FiPlay} label="Pricing" description="View our plans" />
                      <MobileNavLink onClick={() => scrollToSection('faq')} icon={FiPlay} label="FAQ" description="Common questions" />
                      <MobileNavLink onClick={() => scrollToSection('contact')} icon={FiPlay} label="Contact" description="Get in touch" />
                      
                      {/* Divider */}
                      <div className="border-t border-gray-200 my-4"></div>
                      
                      {/* Account Actions */}
                      <MobileNavLink onClick={() => handleNavigateWithScroll('/login')} icon={FiUser} label="Login" description="Access your account" />
                    </nav>

                    {/* Footer Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">
                          Create professional audiobooks with AI
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            No subscriptions
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                            Keep 100% royalties
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Main Content with proper semantic structure */}
        <main className="pt-16" role="main">
          <h1 className="sr-only">
            AudiobookSmith - AI Audiobook Generator for Independent Authors and Publishers
          </h1>
          <Hero />
          <PainPoints />
          <DesiredOutcome />
          <ProductIntro />
          <DemoVideo />
          <ProductShowcase />
          <Testimonials />
          <TransformForm />
          <FAQ />
          <Pricing />
          <Footer />
        </main>

        {/* Sticky CTA Button */}
        <StickyButton />

        {/* Scroll to Top Button */}
        <ScrollToTop />

        {/* Login Modal */}
        {showLoginModal && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
          >
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 id="login-modal-title" className="text-2xl font-bold text-gray-900 mb-6">
                Login to Your Account
              </h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input 
                    id="modal-email"
                    type="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="Enter your email" 
                    aria-describedby="email-help"
                  />
                </div>
                <div>
                  <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input 
                    id="modal-password"
                    type="password" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="Enter your password" 
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <input type="checkbox" id="modal-remember" className="mr-2" />
                    <label htmlFor="modal-remember">Remember me</label>
                  </div>
                  <a href="#" className="text-primary-600 hover:text-primary-800">
                    Forgot password?
                  </a>
                </div>
                <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
                  Login
                </button>
              </form>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => {
                      setShowLoginModal(false);
                      handleNavigateWithScroll('/signup');
                    }} 
                    className="text-primary-600 hover:text-primary-800"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
              <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" 
                onClick={() => setShowLoginModal(false)}
                aria-label="Close login modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ onClick, icon, label, description }) => (
  <motion.button
    onClick={onClick}
    className="w-full flex items-center p-4 text-left hover:bg-gray-50 rounded-xl transition-colors group"
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary-200 transition-colors">
      <SafeIcon icon={icon} className="w-5 h-5 text-primary-600" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-gray-900">{label}</div>
      <div className="text-xs text-gray-500 truncate">{description}</div>
    </div>
    <div className="flex-shrink-0 ml-2">
      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </motion.button>
);

export default SEOOptimizedLandingPage;