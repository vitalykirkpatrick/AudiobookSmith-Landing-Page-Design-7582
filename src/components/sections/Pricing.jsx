import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const { FiCheck, FiX, FiShield, FiZap, FiHeart, FiDownload, FiMail, FiStar, FiMic } = FiIcons;

const Pricing = () => {
  const [isLoading, setIsLoading] = useState(false);

  const pricingPlans = [
    {
      name: "Standard Audiobook Plan",
      amount: 149,
      priceId: "price_1Ri3mt2HUfh6a9CUTTA5lydB",
      paymentLink: "https://buy.stripe.com/dRm28k0ak0BY9rBecP4gg02",
      currency: "usd",
      planKey: "standard",
      description: [
        "Up to 50,000 words",
        "15+ premium AI voices",
        "Commercial license included",
        "Chapter markers",
        "Standard audio quality",
        "Email support"
      ]
    },
    {
      name: "Premium Audiobook Plan", 
      amount: 399,
      priceId: "price_1Ri3mt2HUfh6a9CUYRd1xDud",
      paymentLink: "https://buy.stripe.com/4gM4gs3mwckGavF9Wz4gg00",
      currency: "usd",
      planKey: "premium",
      description: [
        "Up to 150,000 words",
        "30+ premium AI voices",
        "Multiple character voices",
        "Advanced pronunciation controls",
        "Premium audio quality (48kHz)",
        "Priority support",
        "Rush processing (24hr)"
      ]
    },
    {
      name: "Enterprise Audiobook Plan",
      amount: 899,
      priceId: "price_1Ri3mt2HUfh6a9CUKoy2mlo6", 
      paymentLink: "https://buy.stripe.com/8x2eV6f5egAWeLVfgT4gg01",
      currency: "usd",
      planKey: "enterprise",
      description: [
        "Up to 250,000 words",
        "Custom voice cloning",
        "Advanced emotion controls",
        "White-label branding",
        "Website embed options",
        "Priority support (24/7)",
        "Rush processing (12hr)",
        "Advanced analytics"
      ]
    }
  ];

  const competitorFeatures = {
    "Monthly subscription": false,
    "Royalty splits required": false,
    "Manuscript privacy": true,
    "One-time payment": true,
    "Commercial licensing": true,
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('transform-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFreePlanClick = async () => {
    scrollToForm();
  };

  const handlePaymentClick = async (plan) => {
    try {
      setIsLoading(true);
      
      // Get form data if available from the transform-form
      const formElement = document.getElementById('transform-form');
      let userData = {};
      
      if (formElement) {
        // Try to get form data if the form exists and has been filled
        const nameInput = document.querySelector('#transform-form input[name="name"]');
        const emailInput = document.querySelector('#transform-form input[name="email"]');
        const bookTitleInput = document.querySelector('#transform-form input[name="bookTitle"]');
        
        if (nameInput && emailInput) {
          userData = {
            name: nameInput.value || '',
            email: emailInput.value || '',
            bookTitle: bookTitleInput?.value || '',
          };
        }
      }
      
      // Store preliminary user data in Supabase
      if (userData.email) {
        const { data, error } = await supabase
          .from('users_audiobooksmith')
          .upsert([
            { 
              email: userData.email,
              name: userData.name,
              book_title: userData.bookTitle,
              plan: plan.planKey,
              payment_status: 'pending'
            }
          ], { onConflict: 'email' });
          
        if (error) {
          console.error('Error storing preliminary user data:', error);
        }
      }
      
      // Create the success URL with plan parameter and user data
      const currentDomain = window.location.origin;
      const userDataParam = userData.email ? 
        `&name=${encodeURIComponent(userData.name || '')}&email=${encodeURIComponent(userData.email)}&bookTitle=${encodeURIComponent(userData.bookTitle || '')}` : 
        '';
      
      const successUrl = `${currentDomain}/#/onboarding?session_id={CHECKOUT_SESSION_ID}&plan=${plan.planKey}${userDataParam}`;
      
      // Open Stripe checkout with added description
      const stripeUrl = `${plan.paymentLink}?success_url=${encodeURIComponent(successUrl)}&client_reference_id=${userData.email || ''}&description=${encodeURIComponent(plan.description.join(' • '))}`;
      
      window.open(stripeUrl, '_blank');
    } catch (error) {
      console.error('Error initiating payment:', error);
    } finally {
      setIsLoading(false);
    }
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
            Simple, Transparent{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              Pricing
            </span>
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

        <div className="grid lg:grid-cols-4 gap-6 mb-16">
          {/* Free Plan */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="mb-6">
              <div className="text-lg font-semibold text-gray-700 mb-2">Free Sample</div>
              <div className="flex items-end">
                <span className="text-4xl font-bold text-gray-900">$0</span>
              </div>
              <p className="text-gray-600 mt-2 text-sm">Try before you buy</p>
            </div>
            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Up to 5,000 words</span>
              </div>
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Voice cloning (30 sec sample)</span>
              </div>
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">3 AI voices to choose from</span>
              </div>
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">MP3 download</span>
              </div>
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiX} className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-500">No commercial license</span>
              </div>
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiX} className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-500">AudiobookSmith watermark</span>
              </div>
            </div>
            <button
              onClick={handleFreePlanClick}
              disabled={isLoading}
              className="w-full py-3 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiDownload} className="w-5 h-5 mr-2" />
              {isLoading ? 'Processing...' : 'Start Free'}
            </button>
          </motion.div>

          {/* Standard Plan */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-6">
              <div className="text-lg font-semibold text-gray-700 mb-2">{pricingPlans[0].name}</div>
              <div className="flex items-end">
                <span className="text-4xl font-bold text-gray-900">${pricingPlans[0].amount}</span>
                <span className="text-lg ml-2 mb-1 text-gray-500">per book</span>
              </div>
              <p className="text-gray-600 mt-2 text-sm">Perfect for shorter books</p>
            </div>
            <div className="space-y-3 mb-8 flex-grow">
              {pricingPlans[0].description.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handlePaymentClick(pricingPlans[0])}
              disabled={isLoading}
              className="w-full py-3 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiDownload} className="w-5 h-5 mr-2" />
              {isLoading ? 'Processing...' : 'Select Standard'}
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-6 text-white shadow-xl flex flex-col relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Most Popular Tag */}
            <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold text-gray-900 py-1 px-3 rotate-45 transform translate-x-2 -translate-y-1 shadow-sm">
              POPULAR
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <div className="text-lg font-semibold mb-2">{pricingPlans[1].name}</div>
                <div className="flex items-end">
                  <span className="text-4xl font-bold">${pricingPlans[1].amount}</span>
                  <span className="text-lg ml-2 mb-1 opacity-90">per book</span>
                </div>
                <p className="opacity-90 mt-2 text-sm">Best for novels and professional publications</p>
              </div>
              <div className="space-y-3 mb-8 flex-grow">
                {pricingPlans[1].description.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handlePaymentClick(pricingPlans[1])}
                disabled={isLoading}
                className="w-full py-3 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <SafeIcon icon={FiDownload} className="w-5 h-5 mr-2" />
                {isLoading ? 'Processing...' : 'Select Premium'}
              </button>
              <div className="mt-3 text-center text-sm opacity-80">30-day money-back guarantee</div>
            </div>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl flex flex-col border-2 border-yellow-400"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="mb-6">
              <div className="text-lg font-semibold mb-2 flex items-center">
                <SafeIcon icon={FiStar} className="w-5 h-5 mr-2 text-yellow-400" />
                {pricingPlans[2].name}
              </div>
              <div className="flex items-end">
                <span className="text-4xl font-bold">${pricingPlans[2].amount}</span>
                <span className="text-lg ml-2 mb-1 opacity-90">per book</span>
              </div>
              <p className="text-gray-300 mt-2 text-sm">Premium features with voice cloning</p>
            </div>
            <div className="space-y-3 mb-8 flex-grow">
              {pricingPlans[2].description.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handlePaymentClick(pricingPlans[2])}
              disabled={isLoading}
              className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiMail} className="w-5 h-5 mr-2" />
              {isLoading ? 'Processing...' : 'Select Enterprise'}
            </button>
          </motion.div>
        </div>

        {/* Comparison Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="text-center py-6 bg-gray-50 border-b">
            <h3 className="text-2xl font-bold text-gray-900">How We Compare</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(competitorFeatures).map(([feature, included], index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-700 font-medium">{feature}</span>
                  <SafeIcon
                    icon={included ? FiCheck : FiX}
                    className={`w-5 h-5 ${included ? 'text-green-500' : 'text-red-500'}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
              <p className="text-primary-700 text-sm">
                Unlike other services, we don't take a cut of your audiobook earnings or lock you into monthly subscriptions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-primary-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h4>
              <p className="text-gray-600 text-sm">256-bit SSL encryption</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
                <SafeIcon icon={FiZap} className="w-6 h-6 text-primary-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Fast Processing</h4>
              <p className="text-gray-600 text-sm">Most books ready in 2-4 hours</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
                <SafeIcon icon={FiHeart} className="w-6 h-6 text-primary-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Money-Back Guarantee</h4>
              <p className="text-gray-600 text-sm">30-day, no questions asked</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;