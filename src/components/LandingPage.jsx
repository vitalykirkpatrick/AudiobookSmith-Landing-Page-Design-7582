import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from './sections/Hero';
import PainPoints from './sections/PainPoints';
import DesiredOutcome from './sections/DesiredOutcome';
import ProductIntro from './sections/ProductIntro';
import DemoVideo from './sections/DemoVideo';
import ProductShowcase from './sections/ProductShowcase';
import ComparisonTable from './sections/ComparisonTable';
import Testimonials from './sections/Testimonials';
import TransformForm from './sections/TransformForm';
import FAQ from './sections/FAQ';
import Pricing from './sections/Pricing';
import StickyButton from './ui/StickyButton';
import Footer from './sections/Footer';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiUser, FiLogIn } = FiIcons;
const { BsBook, BsSoundwave } = BsIcons;

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.8]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
        style={{ opacity }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Clickable Logo - Returns to Home */}
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-lg overflow-hidden">
                  {/* AI Chip Design */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Chip Background */}
                    <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center relative">
                      {/* Circuit Pattern */}
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
                      {/* Central Processing Unit with Improved Visibility */}
                      <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                        {/* AS Letters - Larger and bolder for better visibility */}
                        <span className="text-[10px] font-extrabold text-primary-600">AS</span>
                      </div>
                      {/* Chip Pins */}
                      <div className="absolute -left-0.5 top-2 w-1 h-0.5 bg-gray-600"></div>
                      <div className="absolute -left-0.5 top-3 w-1 h-0.5 bg-gray-600"></div>
                      <div className="absolute -left-0.5 bottom-2 w-1 h-0.5 bg-gray-600"></div>
                      <div className="absolute -left-0.5 bottom-3 w-1 h-0.5 bg-gray-600"></div>
                      <div className="absolute -right-0.5 top-2 w-1 h-0.5 bg-gray-600"></div>
                      <div className="absolute -right-0.5 top-3 w-1 h-0.5 bg-gray-600"></div>
                      <div className="absolute -right-0.5 bottom-2 w-1 h-0.5 bg-gray-600"></div>
                      <div className="absolute -right-0.5 bottom-3 w-1 h-0.5 bg-gray-600"></div>
                    </div>
                  </div>
                </div>
                {/* Two-color brand name */}
                <span className="text-xl font-bold">
                  <span className="text-primary-600">Audio</span>
                  <span className="text-secondary-600">book</span>
                  <span className="text-primary-600">Smith</span>
                </span>
              </Link>
            </motion.div>

            <motion.div
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => scrollToSection('product-showcase')}
                className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
              >
                Contact
              </button>
              
              {/* User Account Icon */}
              <Link 
                to="/login" 
                className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Login to your account"
              >
                <SafeIcon icon={FiUser} className="w-5 h-5" />
              </Link>
              
              <button
                onClick={() => scrollToSection('transform-form')}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <SafeIcon icon={FiPlay} className="w-4 h-4 mr-2" />
                Get Started
              </button>
            </motion.div>
            
            {/* Mobile menu button - only shown on small screens */}
            <div className="md:hidden flex items-center space-x-4">
              <Link 
                to="/login" 
                className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Login to your account"
              >
                <SafeIcon icon={FiUser} className="w-5 h-5" />
              </Link>
              <button
                onClick={() => scrollToSection('transform-form')}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium text-sm rounded-lg"
              >
                <SafeIcon icon={FiPlay} className="w-3.5 h-3.5 mr-1" />
                Start
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-16">
        <Hero />
        <PainPoints />
        <DesiredOutcome />
        <ProductIntro />
        <DemoVideo />
        <ProductShowcase />
        <ComparisonTable />
        <Testimonials />
        <TransformForm />
        <FAQ />
        <Pricing />
        <Footer />
      </main>

      {/* Sticky CTA Button */}
      <StickyButton />
      
      {/* Login Modal (conditionally rendered) */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Login to Your Account</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="mr-2" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="text-primary-600 hover:text-primary-800">Forgot password?</a>
              </div>
              <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
                Login
              </button>
            </form>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/onboarding?plan=free" className="text-primary-600 hover:text-primary-800">
                  Start with a free sample
                </Link>
              </p>
            </div>
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowLoginModal(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;