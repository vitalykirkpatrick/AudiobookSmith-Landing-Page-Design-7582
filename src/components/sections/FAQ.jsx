import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiChevronDown, FiChevronUp } = FiIcons;

const FAQ = () => {
  const faqs = [
    {
      question: "How secure is my manuscript data on AudiobookSmith?",
      answer: "We take data security seriously. Your manuscripts are protected with enterprise-grade encryption and stored on secure cloud servers. We're GDPR compliant and follow strict privacy protocols. You maintain full ownership of your content, and we never share your data with third parties."
    },
    {
      question: "How does the quality compare to professional human narration?",
      answer: "Our AI voices have been rated as indistinguishable from human narrators in blind tests by 87% of listeners. The technology has advanced dramatically in the last year, delivering natural intonation, proper pacing, and emotional expression."
    },
    {
      question: "Can I use AudiobookSmith for commercial projects?",
      answer: "Absolutely! Your one-time purchase includes a commercial license. You can publish and sell your audiobooks on platforms like Audible, Apple Books, Spotify, and more while keeping 100% of your royalties."
    },
    {
      question: "How long does it take to create an audiobook?",
      answer: "Processing time depends on your manuscript length and current server load. As a benchmark, a 300-page novel (80,000 words) typically processes in 2-3 hours. You'll receive email notifications when your audiobook is ready."
    },
    {
      question: "Can I edit my audiobook after it's created?",
      answer: "Yes! Our cloud-based platform allows you to access your projects anytime to make edits, adjust pronunciations, change voice settings, or regenerate specific chapters. All your projects are saved in your account dashboard."
    },
    {
      question: "What formats can I export my finished audiobook in?",
      answer: "AudiobookSmith exports in industry-standard formats including MP3 (various quality settings), M4B (with chapter markers), and WAV for maximum quality. All formats meet the technical requirements of major distribution platforms."
    },
    {
      question: "What if I'm not satisfied with my purchase?",
      answer: "We offer a no-questions-asked 30-day money-back guarantee. If AudiobookSmith doesn't meet your expectations, simply contact our support team for a full refund."
    },
    {
      question: "What languages are supported?",
      answer: "Currently, AudiobookSmith supports English (US, UK, Australian, and Indian accents), Spanish, French, German, Italian, and Portuguese. We're adding new languages quarterly based on user demand."
    }
  ];

  // State to track which FAQ items are expanded
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Frequently{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              Asked
            </span>{' '}
            Questions
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Everything you need to know about AudiobookSmith
          </motion.p>
        </div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                onClick={() => toggleItem(index)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <SafeIcon
                  icon={expandedItems[index] ? FiChevronUp : FiChevronDown}
                  className="w-5 h-5 text-gray-500"
                />
              </button>
              {expandedItems[index] && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Additional Support CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-gray-600 mb-4">
            Can't find the answer you're looking for?
          </p>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center px-5 py-3 bg-primary-50 text-primary-700 font-medium rounded-lg hover:bg-primary-100 transition-colors"
          >
            Contact our support team
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;