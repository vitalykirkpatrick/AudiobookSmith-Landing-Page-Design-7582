import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiDollarSign, FiClock, FiMeh } = FiIcons;

const PainPoints = () => {
  const painPoints = [
    {
      icon: FiDollarSign,
      quote: "The quotes from studios are in the thousands, which is daunting. Even attempting to produce it myself seems to necessitate a complete audio setup and countless hours of editing.",
      author: "Sarah M., Indie Author",
      color: "from-red-500 to-orange-500",
      bgColor: "from-red-50 to-orange-50",
      borderColor: "border-red-200"
    },
    {
      icon: FiClock,
      quote: "I simply don't have the budget to invest in a professional narrator. Because of that, I end up not creating an audiobook at all.",
      author: "Mike R., Self-Published Author",
      color: "from-orange-500 to-yellow-500",
      bgColor: "from-orange-50 to-yellow-50",
      borderColor: "border-orange-200"
    },
    {
      icon: FiMeh,
      quote: "I've tried AI tools, but the voices sound soulless and robotic. I wish there was something affordable, easy, and actually good.",
      author: "Jennifer L., Educational Content Creator",
      color: "from-yellow-500 to-red-500",
      bgColor: "from-yellow-50 to-red-50",
      borderColor: "border-yellow-200"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Tired of Audiobook Creation{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Barriers?
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            You're not alone. Here's what real authors are saying about the current audiobook landscape:
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${point.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${point.borderColor}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${point.color} mb-4`}>
                  <SafeIcon icon={point.icon} className="w-8 h-8 text-white" />
                </div>
              </div>
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "{point.quote}"
              </blockquote>
              <div className="text-center">
                <cite className="text-sm font-semibold text-gray-500 not-italic">
                  — {point.author}
                </cite>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Belief Deconstruction */}
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 shadow-lg border-2 border-primary-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              The Old Way Is Broken
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Think you need to be a tech expert or have a huge budget to make a great audiobook? That's the old way.
              Most solutions force you into subscriptions, royalty splits, or confusing cloud tools—and still leave you
              disappointed.
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium border border-primary-300">
              There's a better way →
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PainPoints;