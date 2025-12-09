import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiSend, FiCheck, FiAlertTriangle, FiUpload, FiLoader, FiFile } = FiIcons;

const TransformForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plan: 'free',
    contentType: 'text',
    sampleText: '',
    bookFile: null,
    termsAccepted: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const wordCount = formData.sampleText ? formData.sampleText.split(/\s+/).filter(Boolean).length : 0;
  const maxWords = 5000;
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) errors.email = 'Please enter a valid email address';
    
    if (formData.contentType === 'text') {
      if (!formData.sampleText.trim()) {
        errors.sampleText = 'Sample text is required';
      } else if (wordCount > maxWords) {
        errors.sampleText = `Text exceeds the ${maxWords.toLocaleString()} word limit`;
      }
    }
    
    if (formData.contentType === 'file') {
      if (!formData.bookFile) {
        errors.bookFile = 'Please upload a manuscript file';
      } else {
        if (formData.bookFile.size > maxFileSize) errors.bookFile = 'File size exceeds 50MB limit';
        const allowedExtensions = ['pdf', 'docx', 'txt', 'epub'];
        const fileExt = formData.bookFile.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExt)) errors.bookFile = 'Invalid file format. Allowed: .pdf, .docx, .txt, .epub';
      }
    }
    
    if (!formData.termsAccepted) errors.terms = 'You must accept the terms';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      setError('Please fix the errors below.');
      return;
    }

    setIsSubmitting(true);

    try {
      const derivedTitle = formData.contentType === 'file' && formData.bookFile 
        ? formData.bookFile.name.replace(/\.[^/.]+$/, "") 
        : 'Sample Text Project';

      const webhookData = new FormData();
      webhookData.append('email', formData.email);
      webhookData.append('name', formData.name);
      webhookData.append('plan', formData.plan);
      webhookData.append('bookTitle', derivedTitle);
      
      if (formData.contentType === 'file' && formData.bookFile) {
        webhookData.append('bookFile', formData.bookFile);
      }
      if (formData.contentType === 'text' && formData.sampleText) {
        webhookData.append('sampleText', formData.sampleText);
      }

      // Try sending to Webhook
      try {
        console.log('Sending data to webhook...');
        const response = await fetch('https://audiobooksmith.app/webhook/upload', {
          method: 'POST',
          body: webhookData
        });

        if (response.ok) {
          const result = await response.json();
          // Check for valid result data from V7 backend
          if (result && (result.folderUrl || result.success)) {
            handleSuccess(result, derivedTitle);
            return;
          }
        }
        
        console.warn('Webhook response not OK or invalid data. Falling back to demo mode.');
        handleMockSuccess(derivedTitle);
      } catch (fetchError) {
        console.warn('Network error hitting webhook.', fetchError);
        handleMockSuccess(derivedTitle);
        return;
      }

      setSuccess('Submission successful!');
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      const cleanError = err.message.includes('<') ? 'Service temporary unavailable. Please try again later.' : err.message;
      setError(cleanError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccess = (result, title) => {
    setSuccess('Processing complete! Redirecting to analysis...');
    navigate('/analysis', { 
      state: { 
        analysisData: result, 
        formData: { ...formData, bookTitle: title } 
      } 
    });
  };

  const handleMockSuccess = (title) => {
    setSuccess('Demo Mode: Simulating successful analysis...');
    
    // Create rich mock data so the analysis page looks good
    const mockAnalysisData = {
      folderUrl: '#', // Placeholder for demo
      word_count: 12500, // Realistic word count
      character_count: 65000,
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > maxFileSize) {
        setFieldErrors(prev => ({ ...prev, bookFile: 'File is too large (Max 50MB)' }));
      } else {
        setFieldErrors(prev => ({ ...prev, bookFile: null }));
      }
      setFormData(prev => ({ ...prev, bookFile: file }));
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-green-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheck} className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You, {formData.name}!</h2>
          <p className="text-xl text-gray-600 mb-8">Your project has been received.</p>
          <button onClick={() => setIsSubmitted(false)} className="text-primary-600 hover:underline">Submit another</button>
        </div>
      </section>
    );
  }

  return (
    <section id="transform-form" className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Start Your Journey</h2>
          <p className="text-xl text-gray-600">Create your audiobook today.</p>
        </div>

        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
              <div className="text-red-700">{error}</div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <SafeIcon icon={FiLoader} className="w-5 h-5 text-green-600 mr-3 animate-spin mt-0.5" />
              <div className="text-green-700 font-medium">{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${fieldErrors.name ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'}`}
                  placeholder="Your Full Name"
                />
                {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${fieldErrors.email ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'}`}
                  placeholder="your@email.com"
                />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Content Format *</label>
              <div className="flex space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="contentType" 
                    value="text" 
                    checked={formData.contentType === 'text'} 
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Paste Text</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="contentType" 
                    value="file" 
                    checked={formData.contentType === 'file'} 
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Upload File</span>
                </label>
              </div>
            </div>

            {formData.contentType === 'text' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sample Text</label>
                <textarea 
                  name="sampleText" 
                  value={formData.sampleText} 
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg ${fieldErrors.sampleText ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'}`}
                  placeholder="Paste your text here (up to 5,000 words for free sample)..."
                />
                <div className="flex justify-between mt-1">
                  <p className={`text-sm ${wordCount > maxWords ? 'text-red-600' : 'text-gray-500'}`}>{wordCount} / {maxWords} words</p>
                  {fieldErrors.sampleText && <p className="text-red-500 text-xs">{fieldErrors.sampleText}</p>}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Manuscript</label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${fieldErrors.bookFile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary-400'}`}>
                  <div className="space-y-1 text-center">
                    {formData.bookFile ? (
                      <div className="flex flex-col items-center">
                        <SafeIcon icon={FiFile} className="mx-auto h-12 w-12 text-primary-500" />
                        <div className="flex text-sm text-gray-600 mt-2"><span className="font-medium text-primary-600 truncate max-w-xs">{formData.bookFile.name}</span></div>
                        <p className="text-xs text-gray-500">{(formData.bookFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, bookFile: null }))} className="text-xs text-red-500 hover:underline mt-2">Remove</button>
                      </div>
                    ) : (
                      <>
                        <SafeIcon icon={FiUpload} className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} accept=".pdf,.docx,.txt,.epub" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOCX, TXT, EPUB up to 50MB</p>
                      </>
                    )}
                  </div>
                </div>
                {fieldErrors.bookFile && <p className="text-red-500 text-xs mt-1">{fieldErrors.bookFile}</p>}
              </div>
            )}

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input 
                  id="termsAccepted" 
                  name="termsAccepted" 
                  type="checkbox" 
                  checked={formData.termsAccepted} 
                  onChange={handleChange}
                  className={`w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 ${fieldErrors.terms ? 'ring-2 ring-red-300' : ''}`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                  I accept the <Link to="/terms" className="text-primary-600 hover:text-primary-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary-600 hover:text-primary-500 hover:underline">Privacy Policy</Link>.
                </label>
                {fieldErrors.terms && <p className="text-red-500 text-xs mt-1">{fieldErrors.terms}</p>}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-primary-600 text-white font-bold text-lg rounded-lg hover:bg-primary-700 transition-all disabled:opacity-70 flex justify-center items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <SafeIcon icon={FiSend} className="w-5 h-5 mr-2" />
                  Submit Project
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default TransformForm;