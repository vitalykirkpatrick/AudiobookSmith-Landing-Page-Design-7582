import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiCheck, FiX, FiChevronLeft, FiChevronRight } = FiIcons;

const ComparisonTable = () => {
  const [mobileComparisonView, setMobileComparisonView] = useState('audiobooksmith-vs-traditional');

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

  const switchMobileComparison = (direction) => {
    if (direction === 'next') {
      setMobileComparisonView(
        mobileComparisonView === 'audiobooksmith-vs-traditional' 
          ? 'audiobooksmith-vs-competitor' 
          : 'audiobooksmith-vs-traditional'
      );
    } else {
      setMobileComparisonView(
        mobileComparisonView === 'audiobooksmith-vs-competitor' 
          ? 'audiobooksmith-vs-traditional' 
          : 'audiobooksmith-vs-competitor'
      );
    }
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <motion.h2
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              AudiobookSmith
            </span>
          </motion.h2>
          <motion.p
            className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            See the key advantages that make AudiobookSmith the smarter choice
          </motion.p>
        </div>

        {/* Desktop Table */}
        <motion.div
          className="hidden lg:block relative overflow-hidden bg-white rounded-2xl shadow-xl"
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
                className={`grid grid-cols-4 text-center ${
                  feature.highlight ? 'bg-primary-50/30' : ''
                }`}
              >
                <div className="p-6 text-left font-medium text-gray-700">
                  {feature.name}
                </div>
                <div className="p-6 flex items-center justify-center">
                  <SafeIcon
                    icon={feature.audiobooksmith ? FiCheck : FiX}
                    className={`w-6 h-6 ${
                      feature.audiobooksmith ? 'text-green-500' : 'text-red-500'
                    }`}
                  />
                </div>
                <div className="p-6 flex items-center justify-center">
                  <SafeIcon
                    icon={feature.traditional ? FiCheck : FiX}
                    className={`w-6 h-6 ${
                      feature.traditional ? 'text-green-500' : 'text-red-500'
                    }`}
                  />
                </div>
                <div className="p-6 flex items-center justify-center">
                  <SafeIcon
                    icon={feature.competitor ? FiCheck : FiX}
                    className={`w-6 h-6 ${
                      feature.competitor ? 'text-green-500' : 'text-red-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mobile: Two-Column Swipeable Comparison */}
        <motion.div
          className="lg:hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Mobile Comparison Header with Navigation */}
          <div className="bg-white rounded-t-2xl shadow-xl p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => switchMobileComparison('prev')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              >
                <SafeIcon icon={FiChevronLeft} className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <h3 className="text-base font-bold text-gray-900">
                  AudiobookSmith vs{' '}
                  {mobileComparisonView === 'audiobooksmith-vs-traditional' 
                    ? 'Traditional Studios' 
                    : 'Other AI Services'}
                </h3>
                <div className="flex space-x-2 mt-2 justify-center">
                  <div className={`w-2 h-2 rounded-full ${
                    mobileComparisonView === 'audiobooksmith-vs-traditional' 
                      ? 'bg-primary-500' 
                      : 'bg-gray-300'
                  }`}></div>
                  <div className={`w-2 h-2 rounded-full ${
                    mobileComparisonView === 'audiobooksmith-vs-competitor' 
                      ? 'bg-primary-500' 
                      : 'bg-gray-300'
                  }`}></div>
                </div>
              </div>

              <button
                onClick={() => switchMobileComparison('next')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              >
                <SafeIcon icon={FiChevronRight} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Comparison Content */}
          <div className="bg-white rounded-b-2xl shadow-xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileComparisonView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Comparison Header */}
                <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
                  <div className="p-3 text-center font-semibold text-primary-600 bg-gradient-to-r from-primary-50 to-secondary-50 text-sm">
                    AudiobookSmith
                  </div>
                  <div className="p-3 text-center font-semibold text-gray-700 text-sm">
                    {mobileComparisonView === 'audiobooksmith-vs-traditional' 
                      ? 'Traditional Studio' 
                      : 'Other AI Services'}
                  </div>
                </div>

                {/* Comparison Rows */}
                <div className="divide-y divide-gray-200">
                  {features.map((feature, index) => (
                    <div key={index} className={feature.highlight ? 'bg-primary-50/20' : ''}>
                      {/* Feature Name */}
                      <div className="p-3 bg-gray-100 border-b border-gray-200">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">{feature.name}</h4>
                      </div>
                      
                      {/* Comparison Values */}
                      <div className="grid grid-cols-2 min-h-[50px]">
                        {/* AudiobookSmith */}
                        <div className="p-3 flex items-center justify-center bg-gradient-to-r from-primary-50/30 to-secondary-50/30 border-r border-gray-200">
                          <SafeIcon
                            icon={feature.audiobooksmith ? FiCheck : FiX}
                            className={`w-5 h-5 ${
                              feature.audiobooksmith ? 'text-green-500' : 'text-red-500'
                            }`}
                          />
                        </div>

                        {/* Competitor */}
                        <div className="p-3 flex items-center justify-center">
                          <SafeIcon
                            icon={(mobileComparisonView === 'audiobooksmith-vs-traditional' ? feature.traditional : feature.competitor) ? FiCheck : FiX}
                            className={`w-5 h-5 ${
                              (mobileComparisonView === 'audiobooksmith-vs-traditional' ? feature.traditional : feature.competitor) ? 'text-green-500' : 'text-red-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Swipe Instructions */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Tap arrows to compare with different services
            </p>
          </div>
        </motion.div>

        {/* Pricing Summary - Mobile Redesigned */}
        <motion.div
          className="mt-8 md:mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Mobile: Vertical Stack */}
          <div className="block md:hidden space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-primary-500">
              <div className="text-center">
                <div className="text-lg font-bold text-primary-600 mb-1">AudiobookSmith</div>
                <div className="text-2xl font-bold mb-2">$69-499</div>
                <div className="text-gray-500 mb-2 text-sm">One-time or monthly</div>
                <div className="text-green-600 font-medium text-sm bg-green-50 px-3 py-1 rounded-full inline-block">
                  Keep 100% royalties
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-gray-400">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700 mb-1">Traditional Studio</div>
                <div className="text-2xl font-bold mb-2">$2,000+</div>
                <div className="text-gray-500 mb-2 text-sm">Per audiobook</div>
                <div className="text-orange-600 font-medium text-sm bg-orange-50 px-3 py-1 rounded-full inline-block">
                  Additional fees may apply
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-gray-400">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700 mb-1">Other AI Services</div>
                <div className="text-2xl font-bold mb-2">$15-49</div>
                <div className="text-gray-500 mb-2 text-sm">Monthly subscription</div>
                <div className="text-red-600 font-medium text-sm bg-red-50 px-3 py-1 rounded-full inline-block">
                  + Royalty splits (up to 50%)
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-xl font-bold text-primary-600 mb-2">AudiobookSmith</div>
              <div className="text-3xl font-bold mb-2">$69-499</div>
              <div className="text-gray-500 mb-4">One-time or monthly</div>
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
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;