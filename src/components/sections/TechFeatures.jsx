import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import * as AiIcons from 'react-icons/ai';
import * as HiIcons from 'react-icons/hi';
import * as MdIcons from 'react-icons/md';
import SafeIcon from '../../common/SafeIcon';

const { FiCpu, FiSliders, FiUsers, FiGlobe, FiShield } = FiIcons;
const { BsSoundwave, BsSpeedometer, BsVolumeUp } = BsIcons;
const { AiOutlineControl, AiOutlineRobot } = AiIcons;
const { HiOutlineTranslate, HiOutlineSparkles } = HiIcons;
const { MdOutlineSettingsVoice, MdOutlineTimeline } = MdIcons;

const TechFeatures = () => {
  const technologies = [
    {
      title: "State-of-the-Art Voice AI",
      description: "Our proprietary neural voice engine delivers human-like intonation, natural pauses, and emotional expression.",
      icon: AiOutlineRobot,
      color: "from-blue-500 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
      metrics: [
        { label: "Voices Available", value: "85+" },
        { label: "Languages", value: "12" },
        { label: "Quality Rating", value: "4.9/5" }
      ]
    },
    {
      title: "Voice Cloning Technology",
      description: "Create a digital replica of your own voice with just a 30-second audio sample for a truly personalized audiobook.",
      icon: MdOutlineSettingsVoice,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-500/10",
      metrics: [
        { label: "Training Time", value: "2-4 hrs" },
        { label: "Similarity", value: "97%" },
        { label: "Sample Needed", value: "30 sec" }
      ]
    },
    {
      title: "Adaptive Prosody Engine",
      description: "Automatically adjusts pacing, emphasis, and tone based on content context for more engaging narration.",
      icon: BsSoundwave,
      color: "from-teal-500 to-emerald-500",
      bgColor: "from-teal-50 to-emerald-50",
      metrics: [
        { label: "Dynamic Range", value: "High" },
        { label: "Context Awareness", value: "Advanced" },
        { label: "Emotional Tones", value: "18" }
      ]
    }
  ];

  const advancedFeatures = [
    {
      title: "Multi-Character Dialogue Detection",
      description: "Automatically identifies different characters and applies appropriate voices.",
      icon: FiUsers,
      color: "bg-gradient-to-r from-pink-500 to-red-500"
    },
    {
      title: "Acoustic Environment Modeling",
      description: "Apply acoustic environments like 'studio', 'intimate', or 'auditorium'.",
      icon: BsVolumeUp,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      title: "Pronunciation Controls",
      description: "Fine-tune how specific words, names, or technical terms are pronounced.",
      icon: HiOutlineTranslate,
      color: "bg-gradient-to-r from-amber-500 to-orange-500"
    },
    {
      title: "Multi-Language Support",
      description: "Support for 12 languages with regional accent variations.",
      icon: FiGlobe,
      color: "bg-gradient-to-r from-teal-500 to-emerald-500"
    },
    {
      title: "Neural Audio Enhancement",
      description: "AI-powered audio processing for studio-quality output.",
      icon: HiOutlineSparkles,
      color: "bg-gradient-to-r from-purple-500 to-indigo-500"
    },
    {
      title: "Adaptive Pacing",
      description: "Intelligently adjusts reading speed based on content context.",
      icon: BsSpeedometer,
      color: "bg-gradient-to-r from-green-500 to-lime-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-primary-200/20 to-secondary-200/20 rounded-full filter blur-3xl opacity-70 -z-10"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-secondary-200/20 to-primary-200/20 rounded-full filter blur-3xl opacity-70 -z-10"></div>
        
        <div className="text-center mb-16 relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Cutting-Edge <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Technology</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Powered by advanced AI to deliver human-quality audiobooks
          </motion.p>
        </div>

        {/* Core Technologies */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {technologies.map((tech, index) => (
            <motion.div 
              key={index}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tech.bgColor} shadow-lg border border-white`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-white/20 to-transparent rounded-full transform translate-x-1/4 -translate-y-1/4"></div>
              <div className="p-8 relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${tech.color} text-white mb-6 shadow-lg`}>
                  <SafeIcon icon={tech.icon} className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{tech.title}</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">{tech.description}</p>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mt-auto">
                  {tech.metrics.map((metric, i) => (
                    <div key={i} className="bg-white/50 backdrop-blur-sm p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                      <div className="text-xs text-gray-500">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Audio Processing Visualization */}
        <motion.div 
          className="mb-20 relative overflow-hidden bg-white rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid md:grid-cols-2 min-h-[400px]">
            {/* Visual representation of audio processing */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6">
                  <SafeIcon icon={FiCpu} className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Neural Processing Pipeline</h3>
                <p className="text-gray-300 mb-8 max-w-md">Our multi-stage AI processing transforms text into naturally flowing speech with emotional intelligence.</p>
                
                {/* Audio waveform visualization */}
                <div className="h-16 w-full flex items-center justify-center space-x-1">
                  {[...Array(40)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-gradient-to-t from-primary-400 to-secondary-400 rounded-full"
                      style={{ 
                        height: `${Math.sin(i * 0.5) * 50 + 50}%`,
                        opacity: i % 2 === 0 ? 0.8 : 0.5,
                        animationDuration: `${0.8 + (i * 0.05)}s`,
                      }}
                      className="animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Processing stages */}
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How Our AI Processes Your Text</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Text Analysis</h4>
                    <p className="text-gray-600">Analyzes grammar, context, and emotional tone of your content.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Voice Mapping</h4>
                    <p className="text-gray-600">Selects appropriate voice characteristics based on content.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Prosody Generation</h4>
                    <p className="text-gray-600">Creates natural intonation patterns with appropriate emphasis.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">4</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Neural Rendering</h4>
                    <p className="text-gray-600">Generates ultra-realistic voice audio that's indistinguishable from human narration.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">5</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Quality Enhancement</h4>
                    <p className="text-gray-600">Applies acoustic optimization for professional studio-quality audio.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Advanced Features Grid */}
        <div className="mb-16">
          <motion.h3 
            className="text-3xl font-bold text-center text-gray-900 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Advanced Audio Features
          </motion.h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white mb-4 shadow-md`}>
                  <SafeIcon icon={feature.icon} className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Privacy & Security Section - Updated for Cloud Platform */}
        <motion.div 
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-full filter blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <SafeIcon icon={FiShield} className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="md:w-3/4 md:pl-8">
              <h3 className="text-2xl font-bold mb-4">Enterprise-Grade Security & Privacy</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your manuscripts and voice data are protected with bank-level security. We use industry-standard encryption and secure cloud infrastructure to keep your intellectual property safe while enabling you to access and edit your projects anytime, anywhere.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <div className="text-lg font-bold">Secure Cloud Storage</div>
                  <div className="text-sm text-gray-400">Access projects anywhere</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <div className="text-lg font-bold">End-to-End Encryption</div>
                  <div className="text-sm text-gray-400">256-bit protection</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                  <div className="text-lg font-bold">GDPR Compliant</div>
                  <div className="text-sm text-gray-400">Privacy by design</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechFeatures;