import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../SEOHead';
import Footer from '../sections/Footer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const lastUpdated = "May 20, 2024";

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Terms of Service - AudiobookSmith" 
        description="Terms and conditions for using AudiobookSmith's AI audiobook generation services, including copyright ownership and voice cloning guidelines."
        canonicalUrl="https://audiobooksmith.com/terms"
      />

      {/* Header */}
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-500">Last Updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-blue max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the AudiobookSmith platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our Service. These terms constitute a legally binding agreement between you and AudiobookSmith regarding your use of the website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p>
                AudiobookSmith provides AI-powered text-to-speech generation, voice cloning, and audiobook production tools. Our Service allows users to upload text manuscripts and convert them into audio files using synthetic voices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Intellectual Property & Ownership</h2>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-4">
                <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center">
                  <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5 mr-2" />
                  Your Ownership Rights
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-blue-800">
                  <li><strong>Manuscripts:</strong> You retain 100% ownership and copyright of any text or manuscripts you upload.</li>
                  <li><strong>Generated Audio:</strong> Upon payment, you own the commercial rights to the generated audio files. You retain 100% of any royalties earned from distributing these files.</li>
                  <li><strong>No Royalties to Us:</strong> AudiobookSmith does not claim any future royalties or residuals from your audiobooks.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Voice Cloning & Ethics</h2>
              <p className="mb-4">
                Our voice cloning technology is a powerful tool proper usage is strictly enforced:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Authorization:</strong> You represent and warrant that you have the explicit written consent of the person whose voice you are cloning, or that the voice is your own.</li>
                <li><strong>Prohibited Uses:</strong> You may not use voice cloning to create deepfakes, impersonate individuals without consent, or generate misleading content.</li>
                <li><strong>Verification:</strong> We reserve the right to request proof of identity or authorization for any custom voice clone.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use Policy</h2>
              <p>You agree not to use the Service to generate content that:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Is illegal, threatening, defamatory, or promotes hate speech.</li>
                <li>Infringes on the intellectual property rights of others.</li>
                <li>Contains sexually explicit material involving non-consensual acts or minors.</li>
                <li>Attempts to bypass our security measures or usage limits.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment and Refunds</h2>
              <p className="mb-4">
                <strong>Pricing:</strong> Services are provided on a one-time payment or credit basis as described on our Pricing page.
              </p>
              <p>
                <strong>Refund Policy:</strong> We offer a 30-day money-back guarantee if you are not satisfied with the quality of the generated audio, provided you have not downloaded the full audiobook for commercial distribution before requesting the refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
              <p>
                We store your manuscripts and generated audio files securely on our cloud servers to allow you to access and edit your projects. You may delete your data at any time via your dashboard. We are not responsible for data loss due to account deletion or service termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, AudiobookSmith shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at <a href="mailto:support@audiobooksmith.com" className="text-primary-600 hover:underline">support@audiobooksmith.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;