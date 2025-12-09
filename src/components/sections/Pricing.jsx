import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiZap, FiArrowRight } = FiIcons;

const Pricing = () => {
  const navigate = useNavigate();

  const scrollToForm = () => {
    const formElement = document.getElementById('transform-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewFullPricing = () => {
    navigate('/pricing');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Transparent</span> Pricing
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Start free, then choose the plan that fits your publishing needs.
          </motion.p>
        </div>

        {/* Pricing Preview Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Free Sample */}
          <motion.div 
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Sample</h3>
            <div className="text-4xl font-bold text-primary-600 mb-2">$0</div>
            <p className="text-gray-500 mb-6">Try before you buy</p>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-600">Up to 5,000 words</li>
              <li className="text-gray-600">3 AI voices</li>
              <li className="text-gray-600">MP3 download</li>
              <li className="text-gray-600">Ready in 30 minutes</li>
            </ul>
            <button 
              onClick={scrollToForm}
              className="w-full py-3 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 transition-colors"
            >
              Start Free
            </button>
          </motion.div>

          {/* Professional - Most Popular */}
          <motion.div 
            className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 shadow-xl text-white relative transform scale-105"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Floating Badge - Over the corner */}
            <div className="absolute -top-3 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 uppercase tracking-wide">
              Most Popular
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Professional</h3>
            <div className="text-4xl font-bold mb-2">$349</div>
            <p className="opacity-90 mb-6">per book or $99/mo (4 books)</p>
            <ul className="space-y-3 mb-8">
              <li>Up to 150,000 words</li>
              <li>1,300+ AI & human voices</li>
              <li>Advanced emotion control</li>
              <li>Priority support</li>
            </ul>
            <button 
              onClick={handleViewFullPricing}
              className="w-full py-3 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Details
            </button>
          </motion.div>

          {/* Enterprise */}
          <motion.div 
            className="bg-gray-900 rounded-2xl p-8 shadow-xl text-white border-2 border-yellow-400"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <SafeIcon icon={FiZap} className="w-5 h-5 mr-2 text-yellow-400" />
              Enterprise
            </h3>
            <div className="text-4xl font-bold mb-2">$499</div>
            <p className="text-gray-300 mb-6">per month (10 books)</p>
            <ul className="space-y-3 mb-8">
              <li>Unlimited words</li>
              <li>All languages & voices</li>
              <li>White-label branding</li>
              <li>Dedicated support</li>
            </ul>
            <button 
              onClick={handleViewFullPricing}
              className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Learn More
            </button>
          </motion.div>
        </div>

        {/* View Full Pricing CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button 
            onClick={handleViewFullPricing}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg"
          >
            View Complete Pricing & Comparison <SafeIcon icon={FiArrowRight} className="w-5 h-5 ml-2" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;