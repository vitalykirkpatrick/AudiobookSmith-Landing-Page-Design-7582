import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SEOHead from './SEOHead';
import Hero from './sections/Hero';
import PainPoints from './sections/PainPoints';
import DesiredOutcome from './sections/DesiredOutcome';
import ProductIntro from './sections/ProductIntro';
import DemoVideo from './sections/DemoVideo';
import ProductShowcase from './sections/ProductShowcase';
import ComparisonTable from './sections/ComparisonTable';
import Testimonials from './sections/Testimonials';
import TransformForm from './sections/TransformForm';
import FAQ from './sections/FAQ';
import Pricing from './sections/Pricing';
import StickyButton from './ui/StickyButton';
import Footer from './sections/Footer';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiUser, FiLogIn } = FiIcons;
const { BsBook, BsSoundwave } = BsIcons;

const SEOOptimizedLandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.8]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // SEO-optimized structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://audiobooksmith.com/#organization",
        "name": "AudiobookSmith",
        "url": "https://audiobooksmith.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://audiobooksmith.com/logo.png",
          "width": 300,
          "height": 100
        },
        "description": "AI-powered audiobook generation platform for independent authors, educators, and publishers",
        "founder": {
          "@type": "Person",
          "name": "Vitaly Kirkpatrick",
          "jobTitle": "Founder & CEO"
        },
        "foundingDate": "2024",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-800-AUDIOBOOK",
          "contactType": "customer service",
          "email": "support@audiobooksmith.com",
          "availableLanguage": "English"
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US",
          "addressRegion": "CA"
        },
        "sameAs": [
          "https://twitter.com/audiobooksmith",
          "https://linkedin.com/company/audiobooksmith",
          "https://facebook.com/audiobooksmith"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://audiobooksmith.com/#website",
        "url": "https://audiobooksmith.com",
        "name": "AudiobookSmith - AI Audiobook Generator",
        "description": "Create professional audiobooks with AI. Perfect for indie authors and self-publishers.",
        "publisher": {
          "@id": "https://audiobooksmith.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://audiobooksmith.com/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Product",
        "@id": "https://audiobooksmith.com/#product",
        "name": "AudiobookSmith AI Audiobook Generator",
        "description": "Professional AI-powered audiobook creation software for authors, educators, and publishers. Convert your manuscript to audiobook with advanced text-to-speech technology.",
        "brand": {
          "@id": "https://audiobooksmith.com/#organization"
        },
        "category": "Software Application",
        "image": [
          "https://audiobooksmith.com/product-image-1.jpg",
          "https://audiobooksmith.com/product-image-2.jpg",
          "https://audiobooksmith.com/product-image-3.jpg"
        ],
        "offers": [
          {
            "@type": "Offer",
            "name": "Free Sample",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "validFrom": "2024-01-01",
            "description": "Free audiobook sample up to 5,000 words with AI narration"
          },
          {
            "@type": "Offer",
            "name": "Standard Audiobook Plan",
            "price": "149",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "validFrom": "2024-01-01",
            "description": "Professional audiobook creation up to 50,000 words with commercial license"
          },
          {
            "@type": "Offer",
            "name": "Premium Audiobook Plan",
            "price": "399",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "validFrom": "2024-01-01",
            "description": "Advanced audiobook creation up to 150,000 words with multiple character voices"
          },
          {
            "@type": "Offer",
            "name": "Enterprise Audiobook Plan",
            "price": "899",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "validFrom": "2024-01-01",
            "description": "Enterprise audiobook solution with custom voice cloning and white-label branding"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "2847",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "Michael Roberts"
            },
            "reviewBody": "AudiobookSmith transformed my publishing strategy. I produced three audiobooks in a month—something that would have cost me thousands with traditional services."
          },
          {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "Jennifer Williams"
            },
            "reviewBody": "The voice quality is remarkable—my students can't tell the difference from professional narration."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://audiobooksmith.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How to make an audiobook with AI?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "With AudiobookSmith, creating an audiobook with AI is simple: 1) Upload your manuscript, 2) Choose your AI narrator voice, 3) Customize settings like pacing and pronunciation, 4) Generate and download your professional audiobook. The entire process takes just a few hours."
            }
          },
          {
            "@type": "Question",
            "name": "What is the best offline audiobook creator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AudiobookSmith offers secure cloud-based processing that keeps your manuscripts private while providing the convenience of accessing your projects anywhere. Our platform combines the security you want with the accessibility you need."
            }
          },
          {
            "@type": "Question",
            "name": "How much does audiobook production cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AudiobookSmith offers affordable audiobook production starting with a free sample, then one-time payments of $149 for standard books (up to 50k words), $399 for premium (up to 150k words), and $899 for enterprise with voice cloning. No monthly subscriptions or royalty splits required."
            }
          },
          {
            "@type": "Question",
            "name": "Can indie authors create professional audiobooks?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! AudiobookSmith is specifically designed for indie authors and self-publishers. Our AI narration technology produces professional-quality audiobooks that rival traditional studio productions, but at a fraction of the cost and time."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "@id": "https://audiobooksmith.com/#howto",
        "name": "How to Create an Audiobook with AI",
        "description": "Step-by-step guide to creating professional audiobooks using AI technology",
        "image": "https://audiobooksmith.com/how-to-create-audiobook.jpg",
        "totalTime": "PT2H",
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": "149"
        },
        "step": [
          {
            "@type": "HowToStep",
            "name": "Upload Manuscript",
            "text": "Upload your manuscript in TXT, DOCX, PDF, or EPUB format",
            "image": "https://audiobooksmith.com/step1-upload.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Choose AI Narrator",
            "text": "Preview different AI voices and select the perfect match for your story",
            "image": "https://audiobooksmith.com/step2-voice.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Customize Settings",
            "text": "Adjust pacing, add pauses, and fine-tune pronunciation",
            "image": "https://audiobooksmith.com/step3-settings.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Generate & Download",
            "text": "Generate your audiobook and download in professional formats",
            "image": "https://audiobooksmith.com/step4-download.jpg"
          }
        ]
      }
    ]
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* SEO Head Component */}
        <SEOHead
          title="AudiobookSmith - AI Audiobook Generator for Authors & Publishers | No Subscriptions"
          description="Create professional audiobooks with AI in hours, not weeks. Perfect for indie authors, educators & self-publishers. One-time payment, keep 100% royalties. Free sample available."
          keywords="ai audiobook generator, text to speech audiobook, audiobook creation tool, self-publishing audiobooks, indie authors, audiobook software for authors, convert book to audiobook software, affordable audiobook production, no subscription audiobook software, ai narration for self-publishers, secure audiobook generation, batch audiobook processing tool"
          canonicalUrl="https://audiobooksmith.com"
          structuredData={homepageStructuredData}
        />

        {/* Navigation with SEO-optimized structure */}
        <motion.nav 
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
          }`}
          style={{ opacity }}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  aria-label="AudiobookSmith - AI Audiobook Generator Homepage"
                >
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
                </Link>
              </motion.div>

              <motion.div
                className="hidden md:flex items-center space-x-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <button
                  onClick={() => scrollToSection('product-showcase')}
                  className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
                  aria-label="View AudiobookSmith features"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
                  aria-label="Learn how AudiobookSmith works"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
                  aria-label="Frequently asked questions about AI audiobook creation"
                >
                  FAQ
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
                  aria-label="AudiobookSmith pricing plans"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
                  aria-label="Contact AudiobookSmith support"
                >
                  Contact
                </button>
                <Link
                  to="/login"
                  className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Login to your AudiobookSmith account"
                  aria-label="Login to your AudiobookSmith account"
                >
                  <SafeIcon icon={FiUser} className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => scrollToSection('transform-form')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg"
                  aria-label="Start creating your audiobook with AI"
                >
                  <SafeIcon icon={FiPlay} className="w-4 h-4 mr-2" />
                  Get Started
                </button>
              </motion.div>

              <div className="md:hidden flex items-center space-x-4">
                <Link
                  to="/login"
                  className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Login to your AudiobookSmith account"
                  aria-label="Login to your AudiobookSmith account"
                >
                  <SafeIcon icon={FiUser} className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => scrollToSection('transform-form')}
                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium text-sm rounded-lg"
                  aria-label="Start creating your audiobook"
                >
                  <SafeIcon icon={FiPlay} className="w-3.5 h-3.5 mr-1" />
                  Start
                </button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Main Content with proper semantic structure */}
        <main className="pt-16" role="main">
          {/* Header for screen readers */}
          <h1 className="sr-only">
            AudiobookSmith - AI Audiobook Generator for Independent Authors and Publishers
          </h1>
          
          <Hero />
          <PainPoints />
          <DesiredOutcome />
          <ProductIntro />
          <DemoVideo />
          <ProductShowcase />
          <ComparisonTable />
          <Testimonials />
          <TransformForm />
          <FAQ />
          <Pricing />
          <Footer />
        </main>

        {/* Sticky CTA Button */}
        <StickyButton />

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 id="login-modal-title" className="text-2xl font-bold text-gray-900 mb-6">Login to Your Account</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    id="modal-email"
                    type="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="Enter your email"
                    aria-describedby="email-help"
                  />
                </div>
                <div>
                  <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    id="modal-password"
                    type="password" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <input type="checkbox" id="modal-remember" className="mr-2" />
                    <label htmlFor="modal-remember">Remember me</label>
                  </div>
                  <a href="#" className="text-primary-600 hover:text-primary-800">Forgot password?</a>
                </div>
                <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
                  Login
                </button>
              </form>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/onboarding?plan=free" className="text-primary-600 hover:text-primary-800">
                    Start with a free sample
                  </Link>
                </p>
              </div>
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowLoginModal(false)}
                aria-label="Close login modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default SEOOptimizedLandingPage;