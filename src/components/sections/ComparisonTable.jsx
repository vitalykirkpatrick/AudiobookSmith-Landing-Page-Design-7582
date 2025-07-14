import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiCheck, FiX } = FiIcons;

const ComparisonTable = () => {
  const features = [
    {
      name: "One-time payment",
      audiobooksmith: true,
      traditional: false,
      competitor: false,
      highlight: true
    },
    {
      name: "No pre-editing or audio setup required",
      audiobooksmith: true,
      traditional: false,
      competitor: false,
      highlight: true
    },
    {
      name: "AI narration",
      audiobooksmith: true,
      traditional: false,
      competitor: true
    },
    {
      name: "Keep 100% of royalties",
      audiobooksmith: true,
      traditional: false,
      competitor: false,
      highlight: true
    },
    {
      name: "No monthly subscription",
      audiobooksmith: true,
      traditional: true,
      competitor: false
    },
    {
      name: "Professional quality",
      audiobooksmith: true,
      traditional: true,
      competitor: false
    },
    {
      name: "Multiple voices/characters",
      audiobooksmith: true,
      traditional: true,
      competitor: true
    },
    {
      name: "Commercial license included",
      audiobooksmith: true,
      traditional: false,
      competitor: false,
      highlight: true
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            How We{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              Compare
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            See why AudiobookSmith is the smarter choice for authors and publishers
          </motion.p>
        </div>

        <motion.div
          className="relative overflow-hidden bg-white rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Table Header */}
          <div className="grid grid-cols-4 text-center font-semibold border-b border-gray-200">
            <div className="p-6 text-left">Feature</div>
            <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-b-2 border-primary-500">
              <span className="text-primary-600">AudiobookSmith</span>
            </div>
            <div className="p-6">Traditional Studio</div>
            <div className="p-6">Other AI Services</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`grid grid-cols-4 text-center ${feature.highlight ? 'bg-primary-50/30' : ''}`}
              >
                <div className="p-6 text-left font-medium text-gray-700">{feature.name}</div>
                <div className="p-6 flex items-center justify-center">
                  <SafeIcon
                    icon={feature.audiobooksmith ? FiCheck : FiX}
                    className={`w-6 h-6 ${feature.audiobooksmith ? 'text-green-500' : 'text-red-500'}`}
                  />
                </div>
                <div className="p-6 flex items-center justify-center">
                  <SafeIcon
                    icon={feature.traditional ? FiCheck : FiX}
                    className={`w-6 h-6 ${feature.traditional ? 'text-green-500' : 'text-red-500'}`}
                  />
                </div>
                <div className="p-6 flex items-center justify-center">
                  <SafeIcon
                    icon={feature.competitor ? FiCheck : FiX}
                    className={`w-6 h-6 ${feature.competitor ? 'text-green-500' : 'text-red-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Summary */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-xl font-bold text-primary-600 mb-2">AudiobookSmith</div>
            <div className="text-3xl font-bold mb-2">$149</div>
            <div className="text-gray-500 mb-4">Per audiobook</div>
            <div className="text-green-600 font-medium">Keep 100% royalties</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-xl font-bold text-gray-700 mb-2">Traditional Studio</div>
            <div className="text-3xl font-bold mb-2">$2,000+</div>
            <div className="text-gray-500 mb-4">Per audiobook</div>
            <div className="text-gray-600 font-medium">Additional fees may apply</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-xl font-bold text-gray-700 mb-2">Other AI Services</div>
            <div className="text-3xl font-bold mb-2">$15-49</div>
            <div className="text-gray-500 mb-4">Monthly subscription</div>
            <div className="text-red-600 font-medium">+ Royalty splits (up to 50%)</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;