import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMail, FiSend, FiShield, FiHeart, FiZap, FiCheck } = FiIcons;

const Footer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      // Here you would typically send the form data to your backend
      console.log('Contact form submitted:', formData);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const trustBadges = [
    { icon: FiShield, text: "No Technical Skills Required" },
    { icon: FiZap, text: "Instant Download" },
    { icon: FiHeart, text: "Money-Back Guarantee" }
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'Voice Samples', path: '/voice-samples' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Login', path: '/login' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookies Policy', path: '/cookies' }
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content - 2 Column Layout (Product + Form) */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Column 1: AudiobookSmith Info & Links (6 cols) */}
          <motion.div 
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AS</span>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-primary-400">Audio</span>
                <span className="text-secondary-400">book</span>
                <span className="text-primary-400">Smith</span>
              </span>
            </div>
            
            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-lg">
              Empowering authors, educators, and publishers to create professional audiobooks without the traditional barriers of cost, complexity, or technical expertise.
            </p>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-white font-bold text-lg mb-4">Product</h4>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.path} 
                        className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-4">Trust</h4>
                <div className="space-y-3">
                  {trustBadges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <SafeIcon icon={badge.icon} className="w-5 h-5 text-primary-400 flex-shrink-0" />
                      <span className="text-gray-400 text-sm">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Contact Form (6 cols) */}
          <motion.div 
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl h-full">
              <h3 className="text-xl font-bold mb-4">Have Questions?</h3>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-white placeholder-gray-500 text-sm" 
                        placeholder="Your name" 
                        required 
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-white placeholder-gray-500 text-sm" 
                        placeholder="Your email" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <textarea 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      rows={3} 
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-white resize-none placeholder-gray-500 text-sm" 
                      placeholder="How can we help you?" 
                      required 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-[1.02] shadow-lg text-sm"
                  >
                    <SafeIcon icon={FiSend} className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="p-6 bg-green-900/20 border border-green-500/30 rounded-lg text-center h-full flex flex-col justify-center items-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                    <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Message Sent!</h4>
                  <p className="text-green-300 text-sm">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar with Copyright, Legal Links, and Contact */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-500">
            © 2024 AudiobookSmith. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className="text-sm text-gray-500 hover:text-primary-400 transition-colors"
                onClick={() => window.scrollTo(0, 0)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            <a href="mailto:support@audiobooksmith.com" className="text-sm text-gray-500 hover:text-primary-400 transition-colors flex items-center">
              <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
              support@audiobooksmith.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;