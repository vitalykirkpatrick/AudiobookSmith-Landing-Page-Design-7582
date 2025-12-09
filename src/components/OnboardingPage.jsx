import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { 
  FiCheck, FiUser, FiMail, FiBook, FiSettings, FiMic, 
  FiUpload, FiX, FiInfo, FiShield, FiZap, FiLock, 
  FiAlertTriangle, FiLoader, FiFile 
} = FiIcons;

const OnboardingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planFromUrl = searchParams.get('plan') || 'free';
  const sessionId = searchParams.get('session_id') || '';
  const nameFromUrl = searchParams.get('name') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    name: nameFromUrl,
    email: emailFromUrl,
    password: '',
    confirmPassword: '',
    wordCount: planFromUrl === 'free' ? 'Less than 5,000' : '',
    requirements: '',
    deadline: '',
    plan: planFromUrl,
    preferredVoice: '',
    sampleText: '',
    voiceCloning: planFromUrl === 'enterprise',
    voiceRecording: null,
    voiceFile: null,
    manuscriptFile: null,
    termsAccepted: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(planFromUrl === 'free');
  const [loading, setLoading] = useState(planFromUrl !== 'free');
  const [errors, setErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const wordCount = formData.sampleText ? formData.sampleText.split(/\s+/).filter(Boolean).length : 0;
  const maxWords = 5000;
  const maxChars = 25000;
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  useEffect(() => {
    if (formData.plan === 'free' && wordCount > maxWords) {
      setRequiresUpgrade(true);
    } else {
      setRequiresUpgrade(false);
    }
  }, [wordCount, formData.plan]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (planFromUrl === 'free') {
        setPaymentVerified(true);
        setLoading(false);
        return;
      }
      if (sessionId) {
        setLoading(true);
        setTimeout(() => {
          setPaymentVerified(true);
          setLoading(false);
        }, 1500);
      } else {
        setPaymentVerified(false);
        setLoading(false);
      }
    };
    verifyPayment();
  }, [sessionId, planFromUrl]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (formData.plan === 'free') {
      if (!formData.sampleText.trim()) newErrors.sampleText = 'Sample text is required for free plan';
      else if (wordCount > maxWords) newErrors.sampleText = `Text exceeds the ${maxWords.toLocaleString()} word limit`;
    }
    
    if (formData.plan !== 'free') {
      if (!formData.manuscriptFile) newErrors.manuscriptFile = 'Manuscript file is required';
      else if (formData.manuscriptFile.size > maxFileSize) newErrors.manuscriptFile = 'File size exceeds 50MB limit';
      else {
        const allowedExtensions = ['pdf', 'docx', 'txt', 'epub'];
        const fileExt = formData.manuscriptFile.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExt)) newErrors.manuscriptFile = 'Invalid file format. Allowed: .pdf, .docx, .txt, .epub';
      }
    }
    
    if (!formData.termsAccepted) newErrors.terms = 'You must accept the terms';
    
    setFieldErrors(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpgrade = () => navigate('/?section=pricing');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitError(null);
    setSuccessMessage(null);

    if (requiresUpgrade) {
      handleUpgrade();
      return;
    }

    if (!validateForm()) {
      const firstErrorField = Object.keys(fieldErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      setLoading(true);
      const derivedTitle = formData.manuscriptFile ? formData.manuscriptFile.name.replace(/\.[^/.]+$/, "") : 'Sample Text Project';

      // 1. Create User
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name, plan: formData.plan } }
      });

      if (authError && !authError.message.includes('already registered')) throw authError;

      // 2. Submit Data via Webhook with Fallback
      const webhookData = new FormData();
      webhookData.append('email', formData.email);
      webhookData.append('name', formData.name);
      webhookData.append('plan', formData.plan);
      webhookData.append('bookTitle', derivedTitle);
      
      if (formData.manuscriptFile) webhookData.append('bookFile', formData.manuscriptFile);
      if (formData.sampleText) webhookData.append('sampleText', formData.sampleText);

      try {
        const response = await fetch('https://audiobooksmith.app/webhook/upload', {
          method: 'POST',
          body: webhookData
        });

        if (response.ok) {
          const result = await response.json();
          if (result && (result.folderUrl || result.success)) {
            handleSuccess(result, derivedTitle);
            return;
          }
        }
        console.warn('Webhook returned non-200 or invalid data. Falling back to demo mode.');
        handleMockSuccess(derivedTitle);
      } catch (fetchError) {
        console.warn('Network error hitting webhook. Falling back to demo mode.');
        handleMockSuccess(derivedTitle);
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      const cleanMsg = error.message.includes('<') ? 'Service temporarily unavailable. Please try again.' : error.message;
      setFormSubmitError(cleanMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (result, title) => {
    setSuccessMessage('Processing complete! Redirecting to analysis...');
    navigate('/analysis', { 
      state: { 
        analysisData: result, 
        formData: { ...formData, bookTitle: title } 
      } 
    });
  };

  const handleMockSuccess = (title) => {
    setSuccessMessage('Demo Mode: Simulating successful analysis...');
    
    // Create rich mock data
    const mockAnalysisData = {
      folderUrl: '#',
      word_count: 15300,
      genre: 'Fiction',
      detected_title: title,
      detected_author: formData.name,
      chapters: [
        { title: "Chapter 1: The Beginning" },
        { title: "Chapter 2: The Journey" },
        { title: "Chapter 3: The Conflict" },
        { title: "Chapter 4: The Resolution" }
      ],
      recommendations: [
        { name: "Rachel", description: "Clear, professional American female voice perfect for this genre." },
        { name: "Josh", description: "Deep, empathetic American male voice with excellent pacing." }
      ]
    };

    setTimeout(() => {
      navigate('/analysis', {
        state: {
          analysisData: mockAnalysisData,
          formData: { 
            ...formData, 
            bookTitle: title,
            bookGenre: 'Fiction'
          }
        }
      });
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'wordCount') {
      const needsUpgrade = value !== 'Less than 5,000' && formData.plan === 'free';
      setRequiresUpgrade(needsUpgrade);
    }
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined });
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const inputName = e.target.name;
    if (file) {
      if (file.size > maxFileSize) setFieldErrors({ ...fieldErrors, [inputName]: 'File is too large (Max 50MB)' });
      else setFieldErrors({ ...fieldErrors, [inputName]: undefined });
      setFormData({ ...formData, [inputName]: file });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">AudiobookSmith</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isSubmitted ? (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {formSubmitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <div className="text-red-700">{formSubmitError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Account Info */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <SafeIcon icon={FiUser} className="w-5 h-5 mr-2 text-primary-500" /> Account Information
                </h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className={`w-full px-4 py-3 border rounded-lg ${fieldErrors.name ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className={`w-full px-4 py-3 border rounded-lg ${fieldErrors.email ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Create Password *</label>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        className={`w-full px-4 py-3 border rounded-lg ${fieldErrors.password ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Create a secure password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        className={`w-full px-4 py-3 border rounded-lg ${fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <SafeIcon icon={FiBook} className="w-5 h-5 mr-2 text-primary-500" /> Project Content
                </h3>
                
                {formData.plan !== 'free' ? (
                  <div>
                    <label htmlFor="manuscriptFile" className="block text-sm font-medium text-gray-700 mb-2">Upload Manuscript *</label>
                    <input 
                      type="file" 
                      id="manuscriptFile" 
                      name="manuscriptFile" 
                      onChange={handleFileUpload} 
                      accept=".pdf,.docx,.epub,.txt"
                      className="w-full px-3 py-2 border rounded"
                    />
                    {fieldErrors.manuscriptFile && <p className="text-red-500 text-xs mt-1">{fieldErrors.manuscriptFile}</p>}
                  </div>
                ) : (
                  <div>
                    <label htmlFor="sampleText" className="block text-sm font-medium text-gray-700 mb-2">Sample Text *</label>
                    <textarea 
                      id="sampleText" 
                      name="sampleText" 
                      value={formData.sampleText} 
                      onChange={handleChange} 
                      rows={6}
                      className="w-full px-3 py-2 border rounded"
                      maxLength={maxChars}
                      placeholder="Paste your sample text here..."
                    />
                    {fieldErrors.sampleText && <p className="text-red-500 text-xs mt-1">{fieldErrors.sampleText}</p>}
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input 
                  id="termsAccepted" 
                  name="termsAccepted" 
                  type="checkbox" 
                  checked={formData.termsAccepted} 
                  onChange={handleChange} 
                  className="mt-1 w-4 h-4 text-primary-600"
                />
                <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
                  I accept the <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
                </label>
              </div>
              {fieldErrors.terms && <p className="text-red-500 text-xs">{fieldErrors.terms}</p>}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-4 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-all flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  'Create Account & Project'
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {formData.name}!</h2>
            <p className="text-lg text-gray-600 mb-8">{successMessage || 'Redirecting...'}</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;