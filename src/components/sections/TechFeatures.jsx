import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import SafeIcon from '../../common/SafeIcon';

const { FiCpu, FiSettings, FiShield, FiZap, FiGlobe, FiHeadphones } = FiIcons;
const { BsSpeedometer, BsWaveform } = BsIcons;

const TechFeatures = () => {
  // Core tech features
  const coreFeatures = [
    {
      icon: FiCpu,
      title: "Advanced AI Engine",
      description: "Powered by state-of-the-art neural networks specifically optimized for human-like speech patterns and natural prosody."
    },
    {
      icon: BsWaveform,
      title: "Natural Speech Synthesis",
      description: "Our proprietary technology creates natural pauses, emphasis, and emotional inflection based on textual context."
    },
    {
      icon: FiSettings,
      title: "Customization Controls",
      description: "Fine-tune every aspect of your audiobook with intuitive controls for pacing, pronunciation, and voice characteristics."
    },
    {
      icon: FiShield,
      title: "Enterprise-Grade Security",
      description: "Your manuscripts and audio files are protected with end-to-end encryption and secure cloud storage."
    }
  ];

  // Platform capabilities
  const platformCapabilities = [
    {
      icon: FiZap,
      title: "Cloud Processing",
      description: "Leverage our powerful cloud infrastructure for fast processing without taxing your local system."
    },
    {
      icon: BsSpeedometer,
      title: "High-Speed Generation",
      description: "Generate hours of audio in minutes, not days. Our optimized pipeline delivers quality at unprecedented speed."
    },
    {
      icon: FiGlobe,
      title: "Multi-Platform Export",
      description: "Export your audiobooks in formats compatible with all major distribution platforms including Audible and Apple Books."
    },
    {
      icon: FiHeadphones,
      title: "Adaptive Audio Quality",
      description: "Choose from multiple quality settings to balance file size and audio fidelity based on your specific needs."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Powered by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Advanced Technology
            </span>
          </motion.h2>
          <motion.p
            className="text-xl opacity-90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our state-of-the-art AI platform brings your words to life with human-like narration
          </motion.p>
        </div>

        {/* Core Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {coreFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="relative p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 -mt-10 -mr-10 opacity-10">
                <SafeIcon icon={feature.icon} className="w-full h-full text-primary-400" />
              </div>
              <div className="p-2 mb-4 w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                <SafeIcon icon={feature.icon} className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Technology Visualization */}
        <motion.div
          className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl mb-16 p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="absolute inset-0 opacity-30 overflow-hidden">
            {/* Technology Background Pattern */}
            <div className="absolute inset-0 grid grid-cols-12 gap-2">
              {[...Array(60)].map((_, i) => (
                <div
                  key={i}
                  className="col-span-1 h-4 rounded-full bg-primary-500/20"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '3s',
                    animationName: 'pulse',
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'ease-in-out'
                  }}
                />
              ))}
            </div>
            
            {/* Flowing Data Visualization */}
            <div className="absolute top-1/2 left-0 right-0 h-12 overflow-hidden">
              <div
                className="h-full flex items-center"
                style={{
                  animation: 'waveFlow 15s linear infinite',
                  width: '300%'
                }}
              >
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-primary-400 to-secondary-400 rounded-full"
                    style={{
                      height: `${Math.sin(i * 0.5) * 50 + 50}%`,
                      opacity: i % 2 === 0 ? 0.8 : 0.5,
                      animationDuration: `${0.8 + (i * 0.05)}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Neural Voice Technology</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our AI system uses deep neural networks trained on thousands of hours of professional narration to understand the nuances of human speech. This allows us to generate voices that capture the emotional context of your text with natural intonation and pacing.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-200">Advanced neural text analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                  <span className="text-gray-200">Emotional context mapping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-200">Natural prosody generation</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary-400/30 animate-spin-slow"></div>
                <div className="absolute inset-8 rounded-full border-4 border-dashed border-secondary-400/40 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }}></div>
                <div className="absolute inset-16 rounded-full border-4 border-dashed border-primary-400/50 animate-spin-slow" style={{ animationDuration: '20s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg flex items-center justify-center">
                    <SafeIcon icon={BsWaveform} className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Capabilities */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {platformCapabilities.map((capability, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-primary-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-2 mb-4 w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center shadow-lg border border-gray-700">
                <SafeIcon icon={capability.icon} className="w-7 h-7 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{capability.title}</h3>
              <p className="text-gray-300 leading-relaxed">{capability.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechFeatures;