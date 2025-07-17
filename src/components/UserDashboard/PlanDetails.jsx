import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiCreditCard, FiCheck, FiArrowRight, FiInfo } = FiIcons;

const PlanDetails = ({ user }) => {
  const [loading, setLoading] = useState(false);

  const plans = {
    free: {
      name: "Free Sample",
      price: 0,
      features: [
        "Up to 5,000 words",
        "Voice cloning (30 sec sample)",
        "3 AI voices to choose from",
        "MP3 download"
      ],
      color: "gray"
    },
    standard: {
      name: "Standard Audiobook Plan",
      price: 149,
      features: [
        "Up to 50,000 words",
        "15+ premium AI voices",
        "Commercial license",
        "Chapter markers",
        "Standard audio quality",
        "Email support"
      ],
      color: "blue"
    },
    premium: {
      name: "Premium Audiobook Plan",
      price: 399,
      features: [
        "Up to 150,000 words",
        "30+ premium AI voices",
        "Multiple character voices",
        "Advanced pronunciation controls",
        "Premium audio quality (48kHz)",
        "Priority support",
        "Rush processing (24hr)"
      ],
      color: "purple"
    },
    enterprise: {
      name: "Enterprise Audiobook Plan",
      price: 899,
      features: [
        "Up to 250,000 words",
        "Custom voice cloning",
        "Advanced emotion controls",
        "White-label branding",
        "Website embed options",
        "Priority support (24/7)",
        "Rush processing (12hr)",
        "Advanced analytics"
      ],
      color: "indigo"
    }
  };

  const handleUpgrade = async (planId) => {
    setLoading(true);
    try {
      window.location.href = `/#pricing?plan=${planId}`;
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = plans[user?.plan || 'free'];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan & Billing</h2>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{currentPlan.name}</h4>
              <p className="text-gray-600 mt-1">
                ${currentPlan.price} {currentPlan.price > 0 ? '- One-time payment' : ''}
              </p>
            </div>
            {user?.plan === 'free' && (
              <button
                onClick={() => handleUpgrade('standard')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Upgrade Now
              </button>
            )}
          </div>

          <div className="mt-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Features included:</h5>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      {user?.plan !== 'enterprise' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Available Upgrades</h3>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(plans)
                .filter(([id]) => id !== user?.plan && id !== 'free')
                .map(([id, plan]) => (
                  <motion.div
                    key={id}
                    className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                    <p className="text-2xl font-bold text-gray-900 mt-2">${plan.price}</p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleUpgrade(id)}
                      disabled={loading}
                      className="w-full mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Upgrade'}
                    </button>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">About Our Pricing</h4>
            <p className="text-sm text-blue-800">
              All plans are one-time payments. No subscriptions or hidden fees. Your purchase includes lifetime access to your audiobook and commercial rights for distribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;