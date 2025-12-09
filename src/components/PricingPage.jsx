import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import SafeIcon from '../common/SafeIcon';
import ScrollToTop from './ui/ScrollToTop';
import database from '../lib/database';

const { FiCheck, FiX, FiShield, FiZap, FiHeart, FiDownload, FiMail, FiStar, FiMic, FiArrowLeft, FiUser, FiVolume2, FiGlobe, FiEdit, FiClock, FiTarget, FiTrendingUp, FiMenu, FiChevronLeft, FiChevronRight } = FiIcons;
const { BsBook } = BsIcons;

const PricingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileComparisonView, setMobileComparisonView] = useState('audiobooksmith-vs-traditional');

  const pricingPlans = [
    {
      name: "Free Sample",
      amount: 0,
      priceId: "free_sample",
      paymentLink: null,
      currency: "usd",
      planKey: "free",
      wordLimit: "Up to 5,000",
      voices: "1 AI/Cloned",
      turnaround: "30–60 min",
      description: [
        "MP3 download",
        "Watermarked",
        "Try-before-you-buy",
        "Basic editing",
        "Commercial license (watermarked)"
      ]
    },
    {
      name: "Pay As You Go",
      amount: 69,
      priceId: "price_pay_as_you_go",
      paymentLink: "https://buy.stripe.com/dRm28k0ak0BY9rBecP69",
      currency: "usd",
      planKey: "payg",
      wordLimit: "Up to 20,000",
      voices: "Any",
      turnaround: "≤2 hours",
      description: [
        "MP3/WAV export",
        "Chapter editing",
        "Re-conversion/edit included",
        "Commercial license",
        "No watermark"
      ]
    },
    {
      name: "Standard",
      amount: 169,
      priceId: "price_1Ri3mt2HUfh6a9CUTTA5lydB",
      paymentLink: "https://buy.stripe.com/dRm28k0ak0BY9rBecP4gg02",
      currency: "usd",
      planKey: "standard",
      wordLimit: "Up to 50,000",
      voices: "Any",
      turnaround: "≤4 hours",
      description: [
        "All Pro voices",
        "Full editing",
        "Unlimited re-conversion",
        "Multi-format export",
        "Priority support"
      ]
    },
    {
      name: "Professional",
      amount: 349,
      priceId: "price_1Ri3mt2HUfh6a9CUYRd1xDud",
      paymentLink: "https://buy.stripe.com/4gM4gs3mwckGavF9Wz4gg00",
      currency: "usd",
      planKey: "professional",
      wordLimit: "Up to 150,000",
      voices: "1,300+ AI & human voices",
      turnaround: "≤12 hours",
      monthlyOption: { amount: 99, booksIncluded: 4 },
      description: [
        "Batch processing",
        "Priority support",
        "Team dashboard",
        "Advanced emotion & accent control",
        "Celebrity-style voices",
        "Custom voice cloning"
      ]
    },
    {
      name: "Enterprise",
      amount: 499,
      priceId: "price_1Ri3mt2HUfh6a9CUKoy2mlo6",
      paymentLink: "https://buy.stripe.com/8x2eV6f5egAWeLVfgT4gg01",
      currency: "usd",
      planKey: "enterprise",
      wordLimit: "Unlimited",
      voices: "1,300+ voices, all languages",
      turnaround: "≤12 hours",
      isMonthly: true,
      booksIncluded: "10 books/mo",
      extraBookPrice: 39,
      description: [
        "Everything in Professional",
        "5 team seats",
        "Dedicated support",
        "Advanced analytics",
        "White-label branding",
        "Multilingual instant translation/dubbing"
      ]
    }
  ];

  // Separate standard plans from enterprise for better layout
  const standardPlans = pricingPlans.slice(0, 4);
  const enterprisePlan = pricingPlans[4];

  const everyPlanIncludes = [
    "Upload your manuscript, walk away, audiobook delivered",
    "Any AI or studio voice—use your own, celebrity-style, or pick from 1,300+ unique AI voices",
    "100+ languages and dozens of accents for true international editions",
    "Advanced emotion control: happy, dramatic, whispered, angry, or neutral—just a click",
    "Celebrity-style, expressive, and multilingual narration",
    "Instant audio revisions or character replacements, unlimited times",
    "One-click translation/dubbing for international editions",
    "Chapter editing, custom file splitting, and unlimited re-conversions",
    "All major export formats (MP3, WAV, 44/48kHz, segmented/chaptered files)",
    "All processing and voice cloning in the cloud—no hardware or tech skills required",
    "Full commercial license and copyright stays with you",
    "No hidden fees, royalties, earnings share, or mandatory subscription"
  ];

  const comparisonFeatures = [
    { feature: "Keep copyright", audiobooksmith: "Always yours", traditional: "Sometimes, varies", cloudAI: "Sometimes" },
    { feature: "Pay as you go", audiobooksmith: true, traditional: false, cloudAI: "Sometimes" },
    { feature: "Monthly subscription", audiobooksmith: "Optional", traditional: false, cloudAI: true },
    { feature: "Royalty splits", audiobooksmith: "Never", traditional: "Often", cloudAI: "Sometimes" },
    { feature: "Upload, walk away, delivered", audiobooksmith: true, traditional: false, cloudAI: "Sometimes" },
    { feature: "Emotion/accent control", audiobooksmith: "100+ accents, emotions", traditional: "Manual only", cloudAI: "Usually limited" },
    { feature: "Celebrity/multilingual voices", audiobooksmith: "1,300+, 100+ languages", traditional: "Rare, expensive", cloudAI: "Sometimes" },
    { feature: "Editing included", audiobooksmith: "✓ (all plans)", traditional: "✗ (extra cost)", cloudAI: "Sometimes" },
    { feature: "Unlimited instant revisions", audiobooksmith: "✓ (all plans)", traditional: "✗ (extra cost)", cloudAI: "Often limited" },
    { feature: "Chapter control", audiobooksmith: "Full control", traditional: "Limited/extra", cloudAI: "Sometimes" },
    { feature: "Price clarity", audiobooksmith: "Always", traditional: "Unpredictable", cloudAI: "Often complex" },
    { feature: "Turnaround", audiobooksmith: "30min–12hr", traditional: "2–8 weeks", cloudAI: "1–2 days" },
    { feature: "Commercial license", audiobooksmith: "✓ (all plans)", traditional: "Usually expensive", cloudAI: "Sometimes" },
    { feature: "Cloud-based, easy start", audiobooksmith: true, traditional: false, cloudAI: true },
    { feature: "Industry-leading support", audiobooksmith: "Email, chat, dashboard", traditional: "Varies", cloudAI: "Varies" },
    { feature: "Translation/dubbing", audiobooksmith: "One click", traditional: "Manual, costly", cloudAI: "Usually limited" }
  ];

  // Handlers
  const handleFreePlanClick = async () => {
    navigate('/#transform-form');
    setTimeout(() => {
      const element = document.getElementById('transform-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handlePaymentClick = async (plan) => {
    try {
      setIsLoading(true);
      // Logic for handling payment...
      const currentDomain = window.location.origin;
      const successUrl = `${currentDomain}/#/onboarding?session_id={CHECKOUT_SESSION_ID}&plan=${plan.planKey}`;
      const stripeUrl = `${plan.paymentLink}?success_url=${encodeURIComponent(successUrl)}&description=${encodeURIComponent(plan.description.join(' • '))}`;
      window.open(stripeUrl, '_blank');
    } catch (error) {
      console.error('Error initiating payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const handleNavigateWithScroll = (path) => {
    navigate(path);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderComparisonValue = (value) => {
    if (typeof value === 'boolean') {
      return (
        <SafeIcon icon={value ? FiCheck : FiX} className={`w-4 h-4 ${value ? 'text-green-500' : 'text-red-500'}`} />
      );
    }
    return <span className="text-xs font-medium">{value}</span>;
  };

  const switchMobileComparison = (direction) => {
    if (direction === 'next') {
      setMobileComparisonView(
        mobileComparisonView === 'audiobooksmith-vs-traditional' ? 'audiobooksmith-vs-cloud' : 'audiobooksmith-vs-traditional'
      );
    } else {
      setMobileComparisonView(
        mobileComparisonView === 'audiobooksmith-vs-cloud' ? 'audiobooksmith-vs-traditional' : 'audiobooksmith-vs-cloud'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={handleLogoClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center relative">
                    <div className="absolute inset-0">
                      <div className="absolute top-1 left-1 w-2 h-0.5 bg-green-400"></div>
                      <div className="absolute top-1 left-1 w-0.5 h-2 bg-green-400"></div>
                      <div className="absolute top-1 right-1 w-2 h-0.5 bg-blue-400"></div>
                      <div className="absolute top-1 right-1 w-0.5 h-2 bg-blue-400"></div>
                      <div className="absolute bottom-1 left-1 w-2 h-0.5 bg-yellow-400"></div>
                      <div className="absolute bottom-1 left-1 w-0.5 h-2 bg-yellow-400"></div>
                      <div className="absolute bottom-1 right-1 w-2 h-0.5 bg-purple-400"></div>
                      <div className="absolute bottom-1 right-1 w-0.5 h-2 bg-purple-400"></div>
                    </div>
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-[10px] font-extrabold text-primary-600">AS</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold">
                <span className="text-primary-600">Audio</span>
                <span className="text-secondary-600">book</span>
                <span className="text-primary-600">Smith</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={handleLogoClick} className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer">
                Home
              </button>
              <button onClick={() => handleNavigateWithScroll('/voice-samples')} className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer">
                Voices Demo
              </button>
              <button onClick={() => handleNavigateWithScroll('/login')} className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors" title="Login to your account">
                <SafeIcon icon={FiUser} className="w-5 h-5" />
              </button>
              <button onClick={() => handleNavigateWithScroll('/signup')} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg">
                <SafeIcon icon={FiZap} className="w-4 h-4 mr-2" /> Get Started
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMobileMenu} className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Toggle mobile menu">
                <SafeIcon icon={isMobileMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                className="fixed top-16 right-0 w-80 max-w-[90vw] bg-white shadow-2xl z-50 md:hidden border-l border-gray-200"
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <div className="p-6 h-screen overflow-y-auto">
                  <motion.button
                    onClick={() => { setIsMobileMenuOpen(false); handleNavigateWithScroll('/signup'); }}
                    className="w-full mb-6 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-xl shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SafeIcon icon={FiZap} className="w-5 h-5 mr-2" /> Get Started Free
                  </motion.button>

                  <nav className="space-y-2">
                    <MobileNavLink onClick={() => { setIsMobileMenuOpen(false); handleLogoClick(); }} icon={FiArrowLeft} label="Home" description="Back to homepage" />
                    <MobileNavLink onClick={() => { setIsMobileMenuOpen(false); handleNavigateWithScroll('/voice-samples'); }} icon={FiVolume2} label="Voice Samples" description="Listen to AI voices" />
                    <div className="border-t border-gray-200 my-4"></div>
                    <MobileNavLink onClick={() => { setIsMobileMenuOpen(false); handleNavigateWithScroll('/login'); }} icon={FiUser} label="Login" description="Access your account" />
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Header */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Simple, Transparent Pricing</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-6 md:mb-8">
              Start free, then choose the plan that fits your publishing needs. No hidden fees, no royalty splits.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-6 text-center">
                <SafeIcon icon={FiTarget} className="w-5 md:w-8 h-5 md:h-8 mx-auto mb-2 md:mb-3 text-white/90" />
                <div className="text-lg md:text-2xl font-bold mb-1">1,300+</div>
                <div className="text-xs md:text-sm opacity-90 leading-tight">AI Voices</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-6 text-center">
                <SafeIcon icon={FiGlobe} className="w-5 md:w-8 h-5 md:h-8 mx-auto mb-2 md:mb-3 text-white/90" />
                <div className="text-lg md:text-2xl font-bold mb-1">100+</div>
                <div className="text-xs md:text-sm opacity-90 leading-tight">Languages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-6 text-center">
                <SafeIcon icon={FiClock} className="w-5 md:w-8 h-5 md:h-8 mx-auto mb-2 md:mb-3 text-white/90" />
                <div className="text-lg md:text-2xl font-bold mb-1">30min</div>
                <div className="text-xs md:text-sm opacity-90 leading-tight">Fastest Delivery</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-6 text-center">
                <SafeIcon icon={FiTrendingUp} className="w-5 md:w-8 h-5 md:h-8 mx-auto mb-2 md:mb-3 text-white/90" />
                <div className="text-lg md:text-2xl font-bold mb-1">100%</div>
                <div className="text-xs md:text-sm opacity-90 leading-tight">Your Royalties</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans Section with Updated Layout */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Stack Cards Vertically */}
          <div className="block md:hidden space-y-4 mb-12">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`rounded-xl p-4 shadow-lg border-2 ${plan.planKey === 'professional' ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-secondary-50' : plan.planKey === 'enterprise' ? 'border-yellow-400 bg-gray-50' : 'border-gray-200 bg-white'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.planKey === 'professional' && (
                  <div className="bg-primary-500 text-white text-xs font-bold py-1 px-3 rounded-full inline-block mb-3">
                    MOST POPULAR
                  </div>
                )}
                {plan.planKey === 'enterprise' && (
                  <div className="bg-yellow-400 text-gray-900 text-xs font-bold py-1 px-3 rounded-full inline-block mb-3 flex items-center">
                    <SafeIcon icon={FiStar} className="w-3 h-3 mr-1" /> ENTERPRISE
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <div className="flex items-end mb-2">
                      <span className="text-2xl font-bold text-gray-900">${plan.amount}</span>
                      <span className="text-sm text-gray-500 ml-1 mb-1">
                        {plan.isMonthly ? '/mo' : plan.amount > 0 ? ' per book' : ''}
                      </span>
                    </div>
                    {plan.monthlyOption && (
                      <p className="text-xs text-gray-600">
                        or ${plan.monthlyOption.amount}/mo ({plan.monthlyOption.booksIncluded} books)
                      </p>
                    )}
                    {plan.booksIncluded && (
                      <p className="text-xs text-gray-600">
                        {plan.booksIncluded} • Extra: ${plan.extraBookPrice}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>📝 {plan.wordLimit}</div>
                      <div>🎤 {plan.voices}</div>
                      <div>⚡ {plan.turnaround}</div>
                    </div>
                  </div>
                </div>

                {/* Features - Horizontal scroll on mobile */}
                <div className="mb-4">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {plan.description.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex-shrink-0 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={plan.planKey === 'free' ? handleFreePlanClick : () => handlePaymentClick(plan)}
                  disabled={isLoading}
                  className={`w-full py-3 font-bold rounded-lg transition-all flex items-center justify-center text-sm ${plan.planKey === 'professional' ? 'bg-primary-500 text-white hover:bg-primary-600' : plan.planKey === 'enterprise' ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : plan.planKey === 'free' ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                >
                  <SafeIcon icon={plan.planKey === 'free' ? FiDownload : FiDownload} className="w-4 h-4 mr-2" />
                  {isLoading ? 'Processing...' : plan.planKey === 'free' ? 'Start Free' : `Choose ${plan.name}`}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Desktop: New Layout - 4 Grid Top, Enterprise Bottom */}
          {/* Top Row: Standard Plans (Grid of 4) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {standardPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`rounded-2xl p-6 shadow-lg flex flex-col relative ${plan.planKey === 'professional' ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-xl transform lg:scale-105 z-10' : 'bg-white border border-gray-200'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {/* Floating Badge for Professional Plan - Positioned Over the Corner */}
                {plan.planKey === 'professional' && (
                  <div className="absolute -top-3 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="text-lg font-bold mb-2">{plan.name}</div>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">${plan.amount}</span>
                    <span className={`text-sm ml-2 mb-1 ${plan.planKey === 'professional' ? 'text-white/90' : 'text-gray-500'}`}>
                      {plan.isMonthly ? '/mo' : plan.amount > 0 ? ' per book' : ''}
                    </span>
                  </div>
                  {plan.monthlyOption && (
                    <p className={`text-xs mt-1 ${plan.planKey === 'professional' ? 'text-white/80' : 'text-gray-500'}`}>
                      or ${plan.monthlyOption.amount}/mo ({plan.monthlyOption.booksIncluded} books)
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t border-white/20 space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="opacity-70 mr-2">📝</span> {plan.wordLimit}
                    </div>
                    <div className="flex items-center">
                      <span className="opacity-70 mr-2">🎤</span> {plan.voices}
                    </div>
                    <div className="flex items-center">
                      <span className="opacity-70 mr-2">⚡</span> {plan.turnaround}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8 flex-grow">
                  {plan.description.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <SafeIcon icon={FiCheck} className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.planKey === 'professional' ? 'text-white' : 'text-green-500'}`} />
                      <span className={`text-sm ${plan.planKey === 'professional' ? 'text-white/90' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={plan.planKey === 'free' ? handleFreePlanClick : () => handlePaymentClick(plan)}
                  disabled={isLoading}
                  className={`w-full py-3 font-bold rounded-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed ${plan.planKey === 'professional' ? 'bg-white text-primary-600 hover:bg-gray-50 shadow-md' : plan.planKey === 'free' ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'}`}
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                  {isLoading ? 'Processing...' : plan.planKey === 'free' ? 'Start Free' : `Select Plan`}
                </button>
                {plan.planKey === 'professional' && (
                  <div className="mt-3 text-center text-xs opacity-80">30-day money-back guarantee</div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Bottom Row: Enterprise Plan (Full Width) */}
          <div className="hidden md:block">
            <motion.div
              className="bg-gray-900 text-white rounded-2xl p-8 shadow-xl border-2 border-yellow-400 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <SafeIcon icon={FiStar} className="w-32 h-32 text-yellow-400 transform rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Enterprise Header */}
                <div className="lg:w-1/4 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <div className="bg-yellow-400 p-1.5 rounded-lg">
                      <SafeIcon icon={FiStar} className="w-5 h-5 text-gray-900" />
                    </div>
                    <h3 className="text-2xl font-bold">{enterprisePlan.name}</h3>
                  </div>
                  <div className="flex items-end justify-center lg:justify-start gap-2 mt-2">
                    <span className="text-4xl font-bold text-white">${enterprisePlan.amount}</span>
                    <span className="text-lg text-gray-400 mb-1">/mo</span>
                  </div>
                  <p className="text-yellow-400 font-medium text-sm mt-2">{enterprisePlan.booksIncluded}</p>
                  <p className="text-gray-500 text-xs mt-1">Extra books: ${enterprisePlan.extraBookPrice}</p>
                </div>

                {/* Enterprise Features Grid */}
                <div className="lg:w-1/2 border-t lg:border-t-0 lg:border-l border-gray-800 pt-6 lg:pt-0 lg:pl-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {enterprisePlan.description.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="bg-gray-800 p-1 rounded-full">
                          <SafeIcon icon={FiCheck} className="w-3 h-3 text-yellow-400" />
                        </div>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-800 p-1 rounded-full">
                        <SafeIcon icon={FiCheck} className="w-3 h-3 text-yellow-400" />
                      </div>
                      <span className="text-sm text-gray-300">Unlimited Words & Languages</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-800 p-1 rounded-full">
                        <SafeIcon icon={FiCheck} className="w-3 h-3 text-yellow-400" />
                      </div>
                      <span className="text-sm text-gray-300">API Access Available</span>
                    </div>
                  </div>
                </div>

                {/* Enterprise CTA */}
                <div className="lg:w-1/4 flex flex-col items-center justify-center">
                  <button
                    onClick={() => handlePaymentClick(enterprisePlan)}
                    disabled={isLoading}
                    className="w-full py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all flex items-center justify-center shadow-lg hover:shadow-yellow-400/20"
                  >
                    <SafeIcon icon={FiMail} className="w-5 h-5 mr-2" /> Contact Sales
                  </button>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Looking for a custom solution?<br />We offer tailored enterprise contracts.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Every Plan Includes */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-8 md:mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Every Plan Includes</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              All plans come with these powerful features to ensure your audiobook success
            </p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            {everyPlanIncludes.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-4 md:p-6 shadow-md border border-gray-100">
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 md:w-5 md:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm md:text-base text-gray-700 leading-relaxed">{feature}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How We Compare - Completely Redesigned for Mobile */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <motion.h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              How We <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500"> Compare </span>
            </motion.h2>
            <motion.p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
              See why AudiobookSmith is the smarter choice for authors and publishers
            </motion.p>
          </div>

          {/* Desktop Table */}
          <motion.div className="hidden lg:block relative overflow-hidden bg-white rounded-2xl shadow-xl" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}>
            {/* Table Header */}
            <div className="grid grid-cols-4 text-center font-semibold border-b border-gray-200">
              <div className="p-6 text-left">Feature</div>
              <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-b-2 border-primary-500">
                <span className="text-primary-600">AudiobookSmith</span>
              </div>
              <div className="p-6">Traditional Studio</div>
              <div className="p-6">Cloud AI SaaS</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {comparisonFeatures.map((row, index) => (
                <div key={index} className="grid grid-cols-4 text-center">
                  <div className="p-6 text-left font-medium text-gray-700">{row.feature}</div>
                  <div className="p-6 flex items-center justify-center">
                    {renderComparisonValue(row.audiobooksmith)}
                  </div>
                  <div className="p-6 flex items-center justify-center">
                    {renderComparisonValue(row.traditional)}
                  </div>
                  <div className="p-6 flex items-center justify-center">
                    {renderComparisonValue(row.cloudAI)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mobile: Two-Column Swipeable Comparison */}
          <motion.div className="lg:hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}>
            {/* Mobile Comparison Header with Navigation */}
            <div className="bg-white rounded-t-2xl shadow-xl p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <button onClick={() => switchMobileComparison('prev')} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <SafeIcon icon={FiChevronLeft} className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    {mobileComparisonView === 'audiobooksmith-vs-traditional' ? 'vs Traditional Studios' : 'vs Cloud AI Services'}
                  </h3>
                  <div className="flex space-x-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${mobileComparisonView === 'audiobooksmith-vs-traditional' ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${mobileComparisonView === 'audiobooksmith-vs-cloud' ? 'bg-primary-500' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
                <button onClick={() => switchMobileComparison('next')} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
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
                    <div className="p-4 text-center font-semibold text-primary-600 bg-gradient-to-r from-primary-50 to-secondary-50">
                      AudiobookSmith
                    </div>
                    <div className="p-4 text-center font-semibold text-gray-700">
                      {mobileComparisonView === 'audiobooksmith-vs-traditional' ? 'Traditional Studio' : 'Cloud AI SaaS'}
                    </div>
                  </div>

                  {/* Comparison Rows */}
                  <div className="divide-y divide-gray-200">
                    {comparisonFeatures.map((row, index) => (
                      <div key={index}>
                        {/* Feature Name */}
                        <div className="p-3 bg-gray-100 border-b border-gray-200">
                          <h4 className="font-medium text-gray-900 text-sm">{row.feature}</h4>
                        </div>
                        {/* Comparison Values */}
                        <div className="grid grid-cols-2 min-h-[60px]">
                          {/* AudiobookSmith */}
                          <div className="p-3 flex items-center justify-center bg-gradient-to-r from-primary-50/30 to-secondary-50/30 border-r border-gray-200">
                            <div className="text-center">
                              {typeof row.audiobooksmith === 'boolean' ? (
                                <SafeIcon icon={row.audiobooksmith ? FiCheck : FiX} className={`w-5 h-5 mx-auto ${row.audiobooksmith ? 'text-green-500' : 'text-red-500'}`} />
                              ) : (
                                <span className="text-xs font-medium text-primary-700 px-2 py-1 bg-primary-100 rounded-full">
                                  {row.audiobooksmith}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Competitor */}
                          <div className="p-3 flex items-center justify-center">
                            <div className="text-center">
                              {typeof (mobileComparisonView === 'audiobooksmith-vs-traditional' ? row.traditional : row.cloudAI) === 'boolean' ? (
                                <SafeIcon icon={(mobileComparisonView === 'audiobooksmith-vs-traditional' ? row.traditional : row.cloudAI) ? FiCheck : FiX} className={`w-5 h-5 mx-auto ${(mobileComparisonView === 'audiobooksmith-vs-traditional' ? row.traditional : row.cloudAI) ? 'text-green-500' : 'text-red-500'}`} />
                              ) : (
                                <span className="text-xs text-gray-700 px-2 py-1 bg-gray-100 rounded-full">
                                  {mobileComparisonView === 'audiobooksmith-vs-traditional' ? row.traditional : row.cloudAI}
                                </span>
                              )}
                            </div>
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
                Swipe or use arrows to compare with different services
              </p>
            </div>
          </motion.div>

          <motion.div className="mt-6 md:mt-8 text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }}>
            <div className="bg-primary-50 rounded-lg p-4 md:p-6 border border-primary-200 max-w-4xl mx-auto">
              <p className="text-primary-700 text-base md:text-lg font-medium">
                <strong>No surprises. No hidden upsells.</strong> Try it free, or pay once per book—get professional, global-ready audiobooks every time.
              </p>
              <p className="text-primary-600 text-sm mt-2">
                If underlying tech costs rise, pricing may be updated to keep margins fair and service sustainable.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges - Completely Redesigned for Mobile */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Vertical Stack */}
          <div className="block md:hidden space-y-4">
            <motion.div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <SafeIcon icon={FiShield} className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Secure Payment</h4>
                  <p className="text-gray-600 text-sm">256-bit SSL encryption protects your data</p>
                </div>
              </div>
            </motion.div>
            <motion.div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <SafeIcon icon={FiZap} className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Fast Processing</h4>
                  <p className="text-gray-600 text-sm">Most books ready in 2-4 hours or less</p>
                </div>
              </div>
            </motion.div>
            <motion.div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <SafeIcon icon={FiHeart} className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Money-Back Guarantee</h4>
                  <p className="text-gray-600 text-sm">30-day, no questions asked refund policy</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Desktop: Grid Layout */}
          <motion.div className="hidden md:grid md:grid-cols-3 gap-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-6">
                <SafeIcon icon={FiShield} className="w-8 h-8 text-primary-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Secure Payment</h4>
              <p className="text-gray-600">256-bit SSL encryption and secure processing</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-6">
                <SafeIcon icon={FiZap} className="w-8 h-8 text-primary-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Fast Processing</h4>
              <p className="text-gray-600">Most books ready in 2-4 hours</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-6">
                <SafeIcon icon={FiHeart} className="w-8 h-8 text-primary-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Money-Back Guarantee</h4>
              <p className="text-gray-600">30-day, no questions asked</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Create Your Audiobook?</h2>
            <p className="text-lg md:text-xl opacity-90 mb-6 md:mb-8">
              Join thousands of authors who've transformed their publishing with AudiobookSmith
            </p>
            <div className="space-y-4">
              <button onClick={() => handleNavigateWithScroll('/#transform-form')} className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-white text-primary-600 font-bold text-base md:text-lg rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg">
                <SafeIcon icon={FiZap} className="w-5 h-5 mr-2" /> Start Your Free Sample
              </button>
              <p className="text-sm opacity-80">
                No credit card required • Ready in 30 minutes • Commercial license included
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <ScrollToTop />

      {/* Footer with Proper Legal Links Position */}
      <footer className="bg-gray-900 text-white pt-10 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AS</span>
              </div>
              <span className="text-lg font-bold">AudiobookSmith</span>
            </div>

            {/* Bottom Bar Content */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-6 border-t border-gray-800">
              <div className="text-sm text-gray-500">
                © 2024 AudiobookSmith. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">Terms of Service</Link>
                <Link to="/cookies" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">Cookies Policy</Link>
              </div>
              <div className="flex items-center space-x-6">
                <a href="mailto:support@audiobooksmith.com" className="text-sm text-gray-500 hover:text-primary-400 transition-colors flex items-center">
                  <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" /> support@audiobooksmith.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ onClick, icon, label, description }) => (
  <motion.button
    onClick={onClick}
    className="w-full flex items-center p-4 text-left hover:bg-gray-50 rounded-xl transition-colors group"
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary-200 transition-colors">
      <SafeIcon icon={icon} className="w-5 h-5 text-primary-600" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-gray-900">{label}</div>
      <div className="text-xs text-gray-500 truncate">{description}</div>
    </div>
    <div className="flex-shrink-0 ml-2">
      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </motion.button>
);

export default PricingPage;