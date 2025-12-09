import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../SEOHead';
import Footer from '../sections/Footer';
import { Link } from 'react-router-dom';

const CookiesPolicy = () => {
  const lastUpdated = "May 20, 2024";

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Cookies Policy - AudiobookSmith" 
        description="Information about how AudiobookSmith uses cookies to improve your experience and ensure site security."
        canonicalUrl="https://audiobooksmith.com/cookies"
      />

      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AudiobookSmith</span>
            </Link>
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-600">
              Return Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="border-b border-gray-200 pb-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cookies Policy</h1>
            <p className="text-gray-500">Last Updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-blue max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
              <p>AudiobookSmith uses cookies for the following purposes:</p>
              
              <div className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p>These cookies are necessary for the website to function. They enable core features such as:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Logging into your secure account.</li>
                    <li>Processing payments securely.</li>
                    <li>Maintaining your session while you edit audiobooks.</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance & Analytics Cookies</h3>
                  <p>We use these to understand how visitors interact with our website. This helps us improve our user interface and features. We use:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Google Analytics (to track aggregate usage patterns).</li>
                    <li>Performance monitoring tools (to detect page load speeds and errors).</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Functionality Cookies</h3>
                  <p>These allow the website to remember choices you make, such as:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Your preferred language or region.</li>
                    <li>Your voice settings preferences.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Managing Cookies</h2>
              <p>
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you from saving customized settings like login information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Updates to This Policy</h2>
              <p>
                We may update this Cookies Policy from time to time. We encourage you to periodically review this page for the latest information on our privacy practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies, please contact us at <a href="mailto:support@audiobooksmith.com" className="text-primary-600 hover:underline">support@audiobooksmith.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPolicy;