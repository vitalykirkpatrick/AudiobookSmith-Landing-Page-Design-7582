import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import * as HiIcons from 'react-icons/hi';
import SafeIcon from '../../common/SafeIcon';

const { FiTrendingUp, FiZap, FiHeart } = FiIcons;
const { HiSparkles } = HiIcons;

const DesiredOutcome = () => {
  const outcomes = [
    {
      icon: FiTrendingUp,
      title: "Keep your earnings",
      description: "No more surrendering 50% of your royalties—own your audiobook, keep your profits.",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: FiZap,
      title: "Publish faster",
      description: "Turn your manuscript into a polished audiobook in a single afternoon, ready for Audible, Spotify, or your own site.",
      color: "from-blue-500 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      icon: FiHeart,
      title: "Feel proud of the result",
      description: "Your story, your voice—delivered with professional quality that listeners love.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Imagine Audiobook Creation That's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
              Fast, Affordable, and Actually Enjoyable
            </span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {outcomes.map((outcome, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${outcome.bgColor}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${outcome.color} mb-6`}>
                  <SafeIcon icon={outcome.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {outcome.title}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {outcome.description}
                </p>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <SafeIcon icon={HiSparkles} className="w-full h-full" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* New Paradigm Introduction */}
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-3xl font-bold mb-4">
              Introducing a New Era
            </h3>
            <p className="text-xl leading-relaxed opacity-90">
              Professional audiobooks for everyone, powered by secure cloud-based AI.
            </p>
            <div className="mt-6 inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/30 transition-all cursor-pointer">
              <SafeIcon icon={HiSparkles} className="w-5 h-5 mr-2" />
              The future is here
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DesiredOutcome;