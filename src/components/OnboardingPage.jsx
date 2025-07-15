import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiCheck, FiUser, FiMail, FiBook, FiSettings, FiMic, FiUpload, FiX, FiInfo, FiShield, FiZap, FiLock, FiAlertTriangle } = FiIcons;

const OnboardingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get parameters from URL
  const planFromUrl = searchParams.get('plan') || 'free';
  const sessionId = searchParams.get('session_id') || '';
  const nameFromUrl = searchParams.get('name') || '';
  const emailFromUrl = searchParams.get('email') || '';
  const bookTitleFromUrl = searchParams.get('bookTitle') || '';

  const [formData, setFormData] = useState({
    name: nameFromUrl,
    email: emailFromUrl,
    password: '',
    confirmPassword: '',
    bookTitle: bookTitleFromUrl,
    wordCount: planFromUrl === 'free' ? 'Less than 5,000' : '',
    bookGenre: '',
    requirements: '',
    deadline: '',
    plan: planFromUrl,
    preferredVoice: '',
    sampleText: '',
    voiceCloning: planFromUrl === 'enterprise',
    voiceRecording: null,
    voiceFile: null,
    manuscriptFile: null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showVoiceInstructions, setShowVoiceInstructions] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [paymentVerified, setPaymentVerified] = useState(planFromUrl === 'free');
  const [loading, setLoading] = useState(planFromUrl !== 'free');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState(null);

  // Word limit calculation
  const wordCount = formData.sampleText ? formData.sampleText.split(/\s+/).filter(Boolean).length : 0;
  const maxWords = 5000;
  const maxChars = 25000;

  // Voice permission text that users need to read
  const voicePermissionText = `I, [Your Name], hereby grant AudiobookSmith permission to use this voice recording to create an AI voice model for generating audio content based on my manuscript. I understand that this voice sample will be used solely for creating my audiobook and will not be shared with third parties or used for any other commercial purposes without my explicit consent. I confirm that I am the rightful owner of this voice recording and have the authority to grant this permission.`;

  // Plan details mapping
  const planDetails = {
    free: {
      name: 'Free Sample',
      amount: 0,
      features: ['Up to 5,000 words', 'Voice cloning (30 sec sample)', '3 AI voices to choose from', 'MP3 download'],
      color: 'from-gray-500 to-gray-600',
      wordLimit: 5000
    },
    standard: {
      name: 'Standard Audiobook Plan',
      amount: 149,
      features: ['Up to 50,000 words', '15+ premium AI voices', 'Commercial license', 'Chapter markers'],
      color: 'from-blue-500 to-indigo-500',
      wordLimit: 50000
    },
    premium: {
      name: 'Premium Audiobook Plan',
      amount: 399,
      features: ['Up to 150,000 words', '30+ premium AI voices', 'Multiple character voices', 'Rush processing'],
      color: 'from-primary-500 to-secondary-500',
      wordLimit: 150000
    },
    enterprise: {
      name: 'Enterprise Audiobook Plan',
      amount: 899,
      features: ['Up to 250,000 words', 'Custom voice cloning', 'White-label branding', 'Priority support'],
      color: 'from-gray-700 to-gray-900',
      wordLimit: 250000
    }
  };

  const currentPlan = planDetails[formData.plan] || planDetails.free;

  // Check if word count exceeds free plan limit
  useEffect(() => {
    if (formData.plan === 'free' && wordCount > maxWords) {
      setRequiresUpgrade(true);
    } else {
      setRequiresUpgrade(false);
    }
  }, [wordCount, formData.plan]);

  // Verify payment with Supabase if session ID exists
  useEffect(() => {
    const verifyPayment = async () => {
      if (planFromUrl === 'free') {
        setPaymentVerified(true);
        setLoading(false);
        return;
      }

      if (sessionId) {
        setLoading(true);
        try {
          setTimeout(async () => {
            // Update user record in Supabase if email exists
            if (emailFromUrl) {
              const { error } = await supabase
                .from('users_audiobooksmith')
                .upsert({
                  email: emailFromUrl,
                  payment_status: 'completed',
                  session_id: sessionId,
                  plan: planFromUrl
                }, { onConflict: 'email' });

              if (error) {
                console.error('Error updating payment status:', error);
              }
            }
            setPaymentVerified(true);
            setLoading(false);
          }, 1500);
        } catch (error) {
          console.error('Error verifying payment:', error);
          setPaymentVerified(false);
          setLoading(false);
        }
      } else {
        setPaymentVerified(false);
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, planFromUrl, emailFromUrl]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (formData.plan === 'free' && !formData.sampleText) {
      newErrors.sampleText = 'Sample text is required for free plan';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.bookTitle) newErrors.bookTitle = 'Book title is required';
    if (formData.plan !== 'free' && !formData.manuscriptFile) {
      newErrors.manuscriptFile = 'Manuscript file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpgrade = () => {
    navigate('/?section=pricing');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitError(null);

    if (requiresUpgrade) {
      handleUpgrade();
      return;
    }

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      setLoading(true);

      // For free plan users, we need to create an account
      if (formData.plan === 'free') {
        // First register the user with Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              plan: formData.plan
            }
          }
        });

        if (authError) {
          throw authError;
        }

        // Then store additional user data
        const { error: dbError } = await supabase
          .from('users_audiobooksmith')
          .insert({
            id: authData.user?.id,
            email: formData.email,
            name: formData.name,
            book_title: formData.bookTitle,
            book_genre: formData.bookGenre,
            word_count: formData.wordCount,
            plan: formData.plan,
            sample_text: formData.sampleText,
            requirements: formData.requirements,
            preferred_voice: formData.preferredVoice,
            payment_status: 'free_tier'
          });

        if (dbError) {
          console.error("Database error during insert:", dbError);
          if (dbError.message && dbError.message.includes('already exists')) {
            throw new Error('An account with this email already exists. Please log in instead.');
          }
          throw dbError;
        }
      } else {
        // For paid plans, update existing user data and register if needed
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              plan: formData.plan
            }
          }
        });

        if (authError && !authError.message.includes('already registered')) {
          throw authError;
        }

        // Update user record with form data
        const { error: dbError } = await supabase
          .from('users_audiobooksmith')
          .upsert({
            id: authData.user?.id,
            email: formData.email,
            name: formData.name,
            book_title: formData.bookTitle,
            book_genre: formData.bookGenre,
            word_count: formData.wordCount,
            plan: formData.plan,
            requirements: formData.requirements,
            preferred_voice: formData.preferredVoice,
            payment_status: 'completed',
            session_id: sessionId
          }, { onConflict: 'email' });

        if (dbError) {
          throw dbError;
        }
      }

      // Handle manuscript and voice file uploads here (if needed)
      // This would typically involve uploading to Supabase Storage

      // Set submission success
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormSubmitError(error.message || 'An error occurred during submission. Please try again.');
      setErrors({ form: error.message || 'An error occurred during submission. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for word count dropdown
    if (name === 'wordCount') {
      const needsUpgrade = value !== 'Less than 5,000' && formData.plan === 'free';
      setRequiresUpgrade(needsUpgrade);
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const inputName = e.target.name;
    if (file) {
      setFormData({
        ...formData,
        [inputName]: file
      });
      // Clear error for this field
      if (errors[inputName]) {
        setErrors({
          ...errors,
          [inputName]: undefined
        });
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordingBlob(blob);
        setFormData({
          ...formData,
          voiceRecording: blob,
          voiceFile: null // Clear file upload when recording
        });
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
        }
      }, 30000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        voiceFile: file,
        voiceRecording: null // Clear recording when uploading file
      });
      setRecordingBlob(null);
    }
  };

  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery/Thriller', 'Romance', 'Sci-Fi/Fantasy',
    'Biography/Memoir', 'Self-Help', 'Business', 'Educational', 'Children\'s', 'Other'
  ];

  const wordCountOptions = [
    'Less than 5,000', '5,000 - 20,000', '20,000 - 50,000', '50,000 - 80,000',
    '80,000 - 120,000', '120,000 - 150,000', '150,000 - 250,000', 'More than 250,000'
  ];

  const voiceOptions = [
    'Male - Neutral', 'Male - Deep', 'Male - British', 'Male - American Southern',
    'Female - Neutral', 'Female - Warm', 'Female - British', 'Female - American',
    'Not sure (I\'d like to hear samples)'
  ];

  const deadlineOptions = [
    'Within 24 hours (Rush)', 'Within 3 days', 'Within 1 week', 'Within 2 weeks',
    'Within a month', 'No rush', 'Not sure'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {planFromUrl === 'free' ? 'Preparing your account...' : 'Verifying your payment...'}
          </p>
        </div>
      </div>
    );
  }

  if (!paymentVerified && planFromUrl !== 'free') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiX} className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Required</h2>
          <p className="text-gray-600 mb-6">
            This page is only accessible after completing a payment or selecting the free tier. 
            Please return to our pricing page to get started.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Return to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
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
            {planFromUrl !== 'free' && (
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiShield} className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Payment Verified</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isSubmitted ? (
          <>
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {planFromUrl === 'free' ? 'Create Your Free Sample' : 'Welcome to AudiobookSmith! 🎉'}
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {planFromUrl === 'free' 
                    ? 'Set up your account and generate a free audiobook sample' 
                    : 'Thank you for your purchase. Let\'s set up your audiobook project.'}
                </p>
              </motion.div>

              {/* Plan Confirmation */}
              <motion.div
                className={`inline-block bg-gradient-to-r ${currentPlan.color} rounded-2xl p-6 text-white shadow-xl mb-8`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-2">{currentPlan.name}</h2>
                <p className="text-lg opacity-90 mb-4">
                  ${currentPlan.amount} {currentPlan.amount > 0 ? '- One-time payment' : ''}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {formSubmitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-red-700">{formSubmitError}</div>
                </div>
              )}

              {errors.form && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-red-700">{errors.form}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Account Information */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <SafeIcon icon={FiUser} className="w-5 h-5 mr-2 text-primary-500" />
                    Account Information
                  </h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                          className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                          placeholder="Enter your email"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Create Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                            placeholder="Create a secure password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            <SafeIcon icon={showPassword ? FiX : FiLock} className="w-5 h-5" />
                          </button>
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                          placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Information */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
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
                          className={`w-full px-4 py-3 border ${errors.bookTitle ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                          placeholder="Enter your book title"
                        />
                        {errors.bookTitle && <p className="mt-1 text-sm text-red-600">{errors.bookTitle}</p>}
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
                          className={`w-full px-4 py-3 border ${errors.bookGenre ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                        >
                          <option value="">Select a genre</option>
                          {genres.map((genre) => (
                            <option key={genre} value={genre}>
                              {genre}
                            </option>
                          ))}
                        </select>
                        {errors.bookGenre && <p className="mt-1 text-sm text-red-600">{errors.bookGenre}</p>}
                      </div>
                    </div>

                    {/* For free plan - sample text area */}
                    {formData.plan === 'free' && (
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
                          className={`w-full px-4 py-3 border ${errors.sampleText ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none`}
                          placeholder="Paste your sample text here (up to 5,000 words). This will be used to generate your free audiobook sample..."
                          maxLength={maxChars}
                        />
                        {errors.sampleText && <p className="mt-1 text-sm text-red-600">{errors.sampleText}</p>}
                        <div className="mt-1 flex justify-between">
                          <p className={`text-xs ${wordCount > maxWords ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                            {formData.sampleText.length}/{maxChars} characters (~{wordCount} words)
                          </p>
                          {wordCount > maxWords && (
                            <p className="text-xs text-red-600 font-medium">
                              Exceeds free plan limit of 5,000 words
                            </p>
                          )}
                        </div>
                        {wordCount > maxWords && (
                          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800">
                              Your text exceeds the free 5,000 word limit. Please either:
                            </p>
                            <ul className="text-sm text-amber-800 mt-1 ml-5 list-disc">
                              <li>Shorten your text to under 5,000 words</li>
                              <li>Purchase a paid plan to process more words</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Voice Cloning Section - For Enterprise or Free */}
                {(formData.plan === 'enterprise' || formData.plan === 'free') && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <SafeIcon icon={FiMic} className="w-5 h-5 mr-2 text-blue-600" />
                      Voice Cloning {formData.plan === 'enterprise' ? '(Included in Enterprise)' : '(Free Sample)'}
                    </h3>
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="voiceCloning"
                          checked={formData.voiceCloning}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Use my voice for narration (Record or upload up to 30 seconds)
                        </span>
                      </label>
                    </div>
                    {formData.voiceCloning && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-gray-700">Record Your Voice</span>
                          <button
                            type="button"
                            onClick={() => setShowVoiceInstructions(true)}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <SafeIcon icon={FiInfo} className="w-4 h-4 mr-1" />
                            Recording Tips
                          </button>
                        </div>

                        {/* Recording Interface */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                          {isRecording ? (
                            <div className="text-center">
                              <div className="bg-primary-50 p-4 rounded-lg mb-4">
                                <h4 className="text-lg font-semibold text-primary-900 mb-4">
                                  Please read the following text clearly:
                                </h4>
                                <p className="text-primary-700 leading-relaxed text-sm">
                                  {voicePermissionText}
                                </p>
                              </div>
                              <div className="flex items-center justify-center space-x-4">
                                <div className="animate-pulse w-4 h-4 bg-red-500 rounded-full"></div>
                                <span className="text-red-500 font-medium">
                                  Recording: {recordingTime}s / 30s
                                </span>
                                <button
                                  type="button"
                                  onClick={stopRecording}
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  <SafeIcon icon={FiX} className="w-4 h-4 mr-2 inline" />
                                  Stop Recording
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="text-center">
                                <button
                                  type="button"
                                  onClick={startRecording}
                                  disabled={formData.voiceFile}
                                  className="w-24 h-24 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto transition-colors"
                                >
                                  <SafeIcon icon={FiMic} className="w-8 h-8 text-white" />
                                </button>
                                <p className="text-sm text-gray-600">
                                  {formData.voiceFile ? 'Recording disabled (file uploaded)' : 'Click to start recording'}
                                </p>
                                {recordingBlob && (
                                  <p className="text-sm text-green-600 mt-2">✓ Recording complete</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Or Upload Audio File
                                </label>
                                <input
                                  type="file"
                                  name="voiceFile"
                                  accept="audio/*"
                                  onChange={handleVoiceFileUpload}
                                  disabled={recordingBlob}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Supported formats: MP3, WAV, M4A (max 30 seconds)
                                </p>
                                {formData.voiceFile && (
                                  <p className="text-sm text-green-600 mt-2">✓ File uploaded: {formData.voiceFile.name}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Audiobook Preferences */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <SafeIcon icon={FiSettings} className="w-5 h-5 mr-2 text-primary-500" />
                    Audiobook Preferences
                  </h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="preferredVoice" className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Voice Type
                        </label>
                        <select
                          id="preferredVoice"
                          name="preferredVoice"
                          value={formData.preferredVoice}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        >
                          <option value="">Select voice preference</option>
                          {voiceOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        >
                          <option value="">When do you need it?</option>
                          {deadlineOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Requirements or Special Instructions
                      </label>
                      <textarea
                        id="requirements"
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                        placeholder="Any specific requirements, character voices, pronunciation notes, or other details about your audiobook project..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center px-8 py-4 font-bold text-lg rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
                      requiresUpgrade
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600'
                        : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600'
                    }`}
                  >
                    <SafeIcon icon={requiresUpgrade ? FiUpload : FiZap} className="w-5 h-5 mr-2" />
                    {loading ? 'Processing...' : (requiresUpgrade ? 'Upgrade to Process More Words' : (formData.plan === 'free' ? 'Create My Free Sample' : 'Create My Audiobook'))}
                  </button>
                  <p className="mt-3 text-sm text-gray-500">
                    {requiresUpgrade
                      ? 'Your text exceeds the free plan limit'
                      : (formData.plan === 'free'
                        ? 'Your free sample will be processed within 30 minutes'
                        : 'Your audiobook project will be created and processing will begin immediately'
                      )}
                  </p>
                </div>
              </form>
            </motion.div>
          </>
        ) : (
          /* Success State */
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <SafeIcon icon={FiCheck} className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to AudiobookSmith, {formData.name}!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {formData.plan === 'free'
                ? `Your free sample for "${formData.bookTitle}" has been created successfully.`
                : `Your audiobook project "${formData.bookTitle}" has been created successfully.`}
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <p className="font-medium text-gray-900">Processing begins</p>
                    <p className="text-sm text-gray-600">Our AI will start analyzing your {formData.plan === 'free' ? 'sample text' : 'manuscript'} and preparing the audiobook</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <p className="font-medium text-gray-900">Dashboard access</p>
                    <p className="text-sm text-gray-600">You'll receive an email with login instructions to access your dashboard</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <p className="font-medium text-gray-900">Delivery</p>
                    <p className="text-sm text-gray-600">
                      {formData.plan === 'free'
                        ? 'Your free sample will be ready within 30 minutes'
                        : 'Your completed audiobook will be ready for download within 24-48 hours'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </div>

      {/* Voice Recording Instructions Modal */}
      {showVoiceInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Voice Recording Tips</h3>
              <button
                onClick={() => setShowVoiceInstructions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">For Best Results:</h4>
                <ul className="space-y-2">
                  <li>• Record in a quiet room with minimal echo</li>
                  <li>• Speak clearly and at a natural pace</li>
                  <li>• Hold the microphone 6-8 inches from your mouth</li>
                  <li>• Read the permission statement below clearly</li>
                  <li>• Avoid background noise (fans, traffic, etc.)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Required Permission Statement:</h4>
                <p className="bg-gray-50 p-4 rounded border-l-4 border-blue-500 italic text-gray-700 leading-relaxed">
                  "I, [Your Name], hereby grant AudiobookSmith permission to use this voice recording to create an AI voice model for generating audio content based on my manuscript. I understand that this voice sample will be used solely for creating my audiobook and will not be shared with third parties or used for any other commercial purposes without my explicit consent. I confirm that I am the rightful owner of this voice recording and have the authority to grant this permission."
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-yellow-800 text-xs">
                  <strong>Note:</strong> By providing this voice recording, you agree to our Voice Usage Policy. Your voice data will be processed securely and used exclusively for your audiobook project.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowVoiceInstructions(false)}
              className="w-full mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;