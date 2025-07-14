import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const {
  FiSend,
  FiCheck,
  FiUser,
  FiMail,
  FiBook,
  FiAlignLeft,
  FiHelpCircle,
  FiGift,
  FiMic,
  FiUpload,
  FiPlay,
  FiX,
  FiInfo,
  FiFileText,
  FiType,
  FiVolume2,
  FiAlertTriangle
} = FiIcons;

const TransformForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bookTitle: '',
    wordCount: '',
    bookGenre: '',
    requirements: '',
    deadline: '',
    plan: 'free',
    preferredVoice: '',
    contentType: 'text',
    sampleText: '',
    bookFile: null,
    voiceCloning: false
  });

  // UI state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Word count calculation
  const wordCount = formData.sampleText ? formData.sampleText.split(/\s+/).filter(Boolean).length : 0;
  const maxWords = 5000;

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.email.includes('@')) errors.email = 'Valid email is required';
    if (!formData.bookTitle) errors.bookTitle = 'Book title is required';
    if (formData.plan === 'free' && !formData.sampleText) {
      errors.sampleText = 'Sample text is required for free plan';
    }
    if (formData.plan === 'free' && wordCount > maxWords) {
      errors.sampleText = `Text exceeds ${maxWords} words limit`;
    }
    
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create user in Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: Math.random().toString(36).slice(-8), // Generate random password
        options: {
          data: {
            name: formData.name,
            plan: formData.plan
          }
        }
      });

      if (authError && authError.message !== 'User already registered') {
        throw authError;
      }

      // Store form data in Supabase
      const { error: dbError } = await supabase
        .from('users_audiobooksmith')
        .upsert([
          {
            email: formData.email,
            name: formData.name,
            book_title: formData.bookTitle,
            book_genre: formData.bookGenre,
            word_count: formData.wordCount,
            plan: formData.plan,
            sample_text: formData.sampleText,
            requirements: formData.requirements,
            preferred_voice: formData.preferredVoice,
            payment_status: formData.plan === 'free' ? 'free_tier' : 'pending'
          }
        ], { onConflict: 'email' });

      if (dbError) {
        throw dbError;
      }

      setSuccess('Your submission was successful!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.message || 'An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        bookFile: file
      }));
    }
  };

  // Form sections data
  const genres = [
    'Fiction',
    'Non-Fiction',
    'Mystery/Thriller',
    'Romance',
    'Sci-Fi/Fantasy',
    'Biography/Memoir',
    'Self-Help',
    'Business',
    'Educational',
    'Children\'s',
    'Other'
  ];

  const wordCountOptions = [
    'Less than 5,000',
    '5,000 - 20,000',
    '20,000 - 50,000',
    '50,000 - 80,000',
    '80,000 - 120,000',
    '120,000 - 150,000',
    '150,000 - 250,000',
    'More than 250,000'
  ];

  const voiceOptions = [
    'Male - Neutral',
    'Male - Deep',
    'Male - British',
    'Male - American Southern',
    'Female - Neutral',
    'Female - Warm',
    'Female - British',
    'Female - American',
    'Not sure (I\'d like to hear samples)'
  ];

  const deadlineOptions = [
    'Within 24 hours (Rush)',
    'Within 3 days',
    'Within 1 week',
    'Within 2 weeks',
    'Within a month',
    'No rush',
    'Not sure'
  ];

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiCheck} className="w-10 h-10 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You, {formData.name}!
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              {formData.plan === 'free' 
                ? `Your free sample for "${formData.bookTitle}" will be ready in about 30 minutes.`
                : `Your audiobook project "${formData.bookTitle}" has been created successfully.`
              }
            </p>

            <div className="bg-primary-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Next Steps:</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm">1</div>
                  <div>
                    <p className="font-medium text-gray-900">Check Your Email</p>
                    <p className="text-gray-600">We've sent you confirmation details and next steps to {formData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm">2</div>
                  <div>
                    <p className="font-medium text-gray-900">Processing Begins</p>
                    <p className="text-gray-600">Our AI will start analyzing your {formData.plan === 'free' ? 'sample text' : 'manuscript'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm">3</div>
                  <div>
                    <p className="font-medium text-gray-900">Review Your Audiobook</p>
                    <p className="text-gray-600">
                      {formData.plan === 'free' 
                        ? 'Your sample will be ready in about 30 minutes'
                        : 'Your audiobook will be ready within 24-48 hours'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
              >
                <SafeIcon icon={FiUser} className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Link>
              
              <Link
                to="/voice-samples"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <SafeIcon icon={FiVolume2} className="w-5 h-5 mr-2" />
                Browse Voice Samples
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="transform-form" className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Start Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              Audiobook Journey
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Begin with a free sample to experience the quality, then choose your plan
          </motion.p>
        </div>

        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-green-700">{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* About You Section */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <SafeIcon icon={FiUser} className="w-5 h-5 mr-2 text-primary-500" />
                About You
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Book Information */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <SafeIcon icon={FiBook} className="w-5 h-5 mr-2 text-primary-500" />
                Book Details
              </h3>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      id="bookTitle"
                      name="bookTitle"
                      value={formData.bookTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Enter your book title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bookGenre" className="block text-sm font-medium text-gray-700 mb-2">
                      Genre
                    </label>
                    <select
                      id="bookGenre"
                      name="bookGenre"
                      value={formData.bookGenre}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      <option value="">Select a genre</option>
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Content Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    How would you like to provide your content? *
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="radio"
                        id="contentType-text"
                        name="contentType"
                        value="text"
                        checked={formData.contentType === 'text'}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="contentType-text"
                        className="flex p-4 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-center">
                          <SafeIcon icon={FiType} className="w-5 h-5 mr-3 text-primary-500" />
                          <div>
                            <div className="font-medium">Paste Text</div>
                            <div className="text-sm text-gray-500">Copy and paste your content directly</div>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="radio"
                        id="contentType-file"
                        name="contentType"
                        value="file"
                        checked={formData.contentType === 'file'}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="contentType-file"
                        className="flex p-4 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-center">
                          <SafeIcon icon={FiFileText} className="w-5 h-5 mr-3 text-primary-500" />
                          <div>
                            <div className="font-medium">Upload File</div>
                            <div className="text-sm text-gray-500">Upload PDF, EPUB, DOCX, or TXT</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Content Input Based on Selection */}
                {formData.contentType === 'text' && (
                  <div>
                    <label htmlFor="sampleText" className="block text-sm font-medium text-gray-700 mb-2">
                      Sample Text (Up to 5,000 words) *
                    </label>
                    <textarea
                      id="sampleText"
                      name="sampleText"
                      value={formData.sampleText}
                      onChange={handleChange}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                      placeholder="Paste your sample text here (up to 5,000 words). This will be used to generate your free audiobook sample..."
                      required
                    />
                    <div className="mt-2 flex justify-between text-sm">
                      <span className={`${wordCount > maxWords ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        {wordCount} words
                      </span>
                      <span className="text-gray-500">{maxWords - wordCount} words remaining</span>
                    </div>
                  </div>
                )}

                {formData.contentType === 'file' && (
                  <div>
                    <label htmlFor="bookFile" className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Your Manuscript *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-all">
                      <div className="space-y-1 text-center">
                        <SafeIcon icon={FiUpload} className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="bookFile"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="bookFile"
                              name="bookFile"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.epub,.docx,.txt"
                              onChange={handleFileUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, EPUB, DOCX, TXT up to 50MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Voice Preferences */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <SafeIcon icon={FiMic} className="w-5 h-5 mr-2 text-primary-500" />
                Voice Preferences
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="preferredVoice" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Voice Type
                  </label>
                  <select
                    id="preferredVoice"
                    name="preferredVoice"
                    value={formData.preferredVoice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  >
                    <option value="">Select voice preference</option>
                    {voiceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {formData.preferredVoice === "Not sure (I'd like to hear samples)" && (
                    <div className="mt-2">
                      <Link
                        to="/voice-samples"
                        className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
                      >
                        <SafeIcon icon={FiVolume2} className="w-4 h-4 mr-1" />
                        Listen to voice samples →
                      </Link>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                    Desired Timeline
                  </label>
                  <select
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  >
                    <option value="">When do you need it?</option>
                    {deadlineOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Requirements or Notes
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                    placeholder="Any specific requirements, character voices, pronunciation notes, or other details about your audiobook project..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    Processing...
                  </>
                ) : (
                  <>
                    <SafeIcon icon={formData.plan === 'free' ? FiGift : FiSend} className="w-5 h-5 mr-2" />
                    {formData.plan === 'free' ? 'Create My Free Sample' : 'Submit Project'}
                  </>
                )}
              </button>
              
              <p className="mt-3 text-sm text-gray-500 flex items-center justify-center">
                <SafeIcon icon={FiHelpCircle} className="w-4 h-4 mr-1" />
                {formData.plan === 'free'
                  ? 'Your free sample will be ready in 30 minutes'
                  : 'We\'ll respond within 24 hours with your custom plan'
                }
              </p>
            </div>
          </form>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-12 grid md:grid-cols-3 gap-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500" />
            <span>Free sample, no card required</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500" />
            <span>Ready in 30 minutes</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500" />
            <span>Upgrade anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TransformForm;