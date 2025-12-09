import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../SEOHead';
import Footer from '../sections/Footer';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const lastUpdated = "May 20, 2024";

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Privacy Policy - AudiobookSmith" 
        description="How AudiobookSmith protects your manuscripts, voice data, and personal information. We prioritize author security and data privacy."
        canonicalUrl="https://audiobooksmith.com/privacy"
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-500">Last Updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-blue max-w-none text-gray-700 space-y-8">
            <section>
              <p className="lead text-lg text-gray-600">
                At AudiobookSmith, we understand that for authors and publishers, your intellectual property is your livelihood. We are committed to protecting the privacy and security of your manuscripts, voice data, and personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, and login credentials.</li>
                <li><strong>Content Data:</strong> The text manuscripts, books, or scripts you upload for processing.</li>
                <li><strong>Voice Data:</strong> Audio recordings you upload for the purpose of creating a custom voice clone.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our service, including generation history and preferences.</li>
                <li><strong>Payment Information:</strong> Processed securely by our payment provider (Stripe); we do not store your full credit card details.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Data</h2>
              <p className="mb-4">We use your information solely to provide and improve our services:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To generate audio files from your text inputs.</li>
                <li>To create and store your custom voice models (if applicable).</li>
                <li>To process payments and manage your account.</li>
                <li>To communicate with you regarding your projects and service updates.</li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                <strong>Important Note on AI Training:</strong> We DO NOT use your private manuscripts or custom voice recordings to train public or foundation AI models that are available to other users. Your content remains isolated to your account.
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Voice Data Security</h2>
              <p>
                If you use our Voice Cloning feature, your audio samples are encrypted and processed solely for the purpose of creating your specific voice model. This voice model is accessible only by you and is not shared with the public library unless you explicitly opt-in to a revenue-sharing program (if available).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Manuscript Protection</h2>
              <p>
                Your manuscripts are transmitted via secure SSL/TLS encryption. They are stored on secure cloud servers with strict access controls. We do not claim any ownership rights to your text, and we do not sell your content to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
              <p>
                We collaborate with trusted third-party providers to deliver our services. These may include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Voice Synthesis Providers:</strong> (e.g., ElevenLabs, Unmixr) for audio generation processing.</li>
                <li><strong>Cloud Storage:</strong> (e.g., AWS, Supabase) for secure file hosting.</li>
                <li><strong>Payment Processors:</strong> (e.g., Stripe) for billing.</li>
              </ul>
              <p className="mt-2">
                These providers process data in accordance with their own strict privacy policies and data protection agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p>
                Depending on your location (e.g., GDPR, CCPA), you may have rights to access, correct, or delete your personal data. You can exercise these rights by contacting our support team or using the deletion tools within your account dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
              <p>
                For privacy-related inquiries, please contact our Data Protection Officer at <a href="mailto:support@audiobooksmith.com" className="text-primary-600 hover:underline">support@audiobooksmith.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;