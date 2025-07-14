import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  return (
    <footer id="contact" className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Empowering authors, educators, and publishers to create professional audiobooks without the traditional barriers of cost, complexity, or technical expertise.
            </p>
            
            {/* Trust Badges */}
            <div className="space-y-4 mb-8">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <SafeIcon icon={badge.icon} className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">{badge.text}</span>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-gray-400">
              <p>© 2024 AudiobookSmith. All rights reserved.</p>
              <p className="mt-2">
                Questions? Email us at{' '}
                <a
                  href="mailto:support@audiobooksmith.com"
                  className="text-primary-400 hover:text-primary-300"
                >
                  support@audiobooksmith.com
                </a>
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6">Have Questions?</h3>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-white"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-white resize-none"
                    placeholder="Tell us about your audiobook project..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <SafeIcon icon={FiSend} className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            ) : (
              <div className="p-6 bg-green-900/50 border border-green-500/50 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-400" />
                  <h4 className="text-xl font-semibold text-green-400">Message Sent!</h4>
                </div>
                <p className="text-green-300">
                  Thank you for reaching out! We'll get back to you within 24 hours.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;