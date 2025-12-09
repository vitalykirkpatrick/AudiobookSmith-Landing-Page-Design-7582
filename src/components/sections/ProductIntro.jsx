import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import TechFeatures from './TechFeatures';

const { FiUpload, FiMic, FiPlay, FiUser, FiMail, FiSettings, FiVolume2 } = FiIcons;

const ProductIntro = () => {
  const steps = [
    {
      number: "01",
      icon: FiUpload,
      title: "Upload your manuscript",
      description: "TXT, DOCX, PDF, or EPUB - we support all major formats",
      color: "from-blue-500 to-indigo-500"
    },
    {
      number: "02",
      icon: FiMic,
      title: "Choose your AI narrator",
      description: "Preview different voices and find the perfect match for your story",
      color: "from-indigo-500 to-purple-500"
    },
    {
      number: "03",
      icon: FiSettings,
      title: "Customize settings",
      description: "Adjust pacing, add pauses, and fine-tune pronunciation",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "04",
      icon: FiPlay,
      title: "Generate & download",
      description: "Sit back and relax - get your finished audiobook in hours",
      color: "from-pink-500 to-red-500"
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Introduction */}
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                AudiobookSmith
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The audiobook generator that anyone can use.{' '}
              <span className="font-semibold text-primary-600">No audio expertise, no subscriptions, no compromises.</span>
            </motion.p>
          </div>

          {/* 4-Step Process */}
          <div className="mb-20">
            <motion.h3
              className="text-3xl font-bold text-center text-gray-900 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              How It Works: 4 Simple Steps
            </motion.h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center h-full">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.color} mb-6`}>
                      <SafeIcon icon={step.icon} className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm font-bold text-gray-400 mb-2">STEP {step.number}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>

                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform -translate-y-1/2"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Voice Samples CTA */}
          <motion.div
            className="max-w-4xl mx-auto mb-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
                <SafeIcon icon={FiVolume2} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Hear Our AI Voices in Action
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Listen to samples from our collection of 85+ premium AI voices. From warm and friendly to professional and authoritative, find the perfect voice for your audiobook.
              </p>
              <Link
                to="/voice-samples"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <SafeIcon icon={FiVolume2} className="w-5 h-5 mr-2" />
                Listen to Voice Samples
              </Link>
              <p className="text-sm text-gray-500 mt-2">
                Free to browse • No signup required
              </p>
            </div>
          </motion.div>

          {/* Message from Founder */}
          <motion.div
            className="max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiUser} className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">A Message from the Founder</h4>
                  <blockquote className="text-lg text-gray-700 leading-relaxed italic mb-4">
                    "As a fellow creator, I was frustrated by the barriers to audiobook publishing. AudiobookSmith was built so you don't need expensive equipment or technical skills to create professional audio. Let's put your story in every ear without the complexity or high costs."
                  </blockquote>
                  <cite className="text-primary-600 font-semibold not-italic">
                    — Vitaly Kirkpatrick, Published Author and Founder of AudiobookSmith
                  </cite>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Final CTA Block */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-3xl font-bold mb-4">Ready to turn your book into an audiobook—on your terms?</h3>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of authors who've already made the switch to AudiobookSmith
              </p>
              <button
                onClick={() => scrollToSection('transform-form')}
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
              >
                <SafeIcon icon={FiPlay} className="w-5 h-5 mr-2" />
                Start My Audiobook Now
              </button>
              <div className="mt-4 text-sm opacity-80">One-time payment • No monthly fees • 30-day guarantee</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Features Section - Added Below How It Works */}
      <TechFeatures />
    </>
  );
};

export default ProductIntro;