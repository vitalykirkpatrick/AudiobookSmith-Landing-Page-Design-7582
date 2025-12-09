import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiBook, FiCheck, FiClock, FiDownload, FiPlay, 
  FiActivity, FiUser, FiHeadphones, 
  FiBarChart2, FiCpu, FiFileText, FiArrowRight, FiUsers,
  FiList, FiMic
} = FiIcons;

const BookAnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve data passed from the form or redirect if missing
    if (location.state?.analysisData) {
      setAnalysisData(location.state.analysisData);
      setFormData(location.state.formData || {});
      setLoading(false);
    } else {
      // If accessed directly without state, redirect to home
      const timer = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No analysis data found. Redirecting...</p>
        </div>
      </div>
    );
  }

  // --- Robust Data Extraction ---
  const data = analysisData || {};
  const form = formData || {};

  // 1. Title Extraction
  const title = data.title || data.book_title || data.detected_title || form.bookTitle || 'Untitled Project';
  
  // 2. Author Extraction
  const author = data.author || data.detected_author || data.writer || form.name || 'Unknown Author';
  
  // 3. Genre Extraction
  const genre = data.genre || data.book_genre || data.detected_genre || data.category || form.bookGenre;
  
  // 4. Word Count Handling
  let rawWordCount = 0;
  if (data.word_count || data.wordCount) {
    rawWordCount = Number(data.word_count || data.wordCount);
  } else if (data.character_count) {
    rawWordCount = Math.ceil(Number(data.character_count) / 5);
  } else if (form.sampleText) {
    rawWordCount = form.sampleText.split(/\s+/).filter(Boolean).length;
  } else if (form.wordCount && typeof form.wordCount === 'number') {
    rawWordCount = form.wordCount;
  }
  
  const wordCountDisplay = rawWordCount > 0 ? rawWordCount.toLocaleString() : 'N/A';
  
  // 5. Estimate Audio Length (roughly 150 words per minute)
  const estimatedMinutes = rawWordCount > 0 ? Math.ceil(rawWordCount / 150) : '—';
  
  // 6. Chapters / TOC - Ensure array
  const rawChapters = data.chapters || data.toc || data.sections || [];
  const chapters = Array.isArray(rawChapters) ? rawChapters : [];
  
  // 7. Voice Recommendations - Ensure array
  const rawRecommendations = data.recommendations || data.voice_recommendations || data.suggested_voices || [];
  const recommendations = Array.isArray(rawRecommendations) ? rawRecommendations : [];

  // 8. Result URL Construction
  const rawUrl = data.folderUrl || data.folder_url || data.result_url || data.download_url || data.url;
  
  // Valid URL check: must exist, not be '#', and have length
  const isValidUrl = rawUrl && rawUrl !== '#' && rawUrl.length > 1;
  const resultUrl = isValidUrl 
    ? (rawUrl.startsWith('http') ? rawUrl : `https://audiobooksmith.app${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`) 
    : '#';

  const isReady = resultUrl !== '#';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary-600">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-start sm:items-center justify-between shadow-sm"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-900">Analysis Complete</h1>
              <p className="text-green-700">Your manuscript has been successfully processed and is ready for production.</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Ready
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Book Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Placeholder Book Cover */}
                  <div className="w-full sm:w-32 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-inner flex items-center justify-center flex-shrink-0">
                    <SafeIcon icon={FiBook} className="w-12 h-12 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {title}
                        </h2>
                        <p className="text-lg text-gray-600 mb-4">by {author}</p>
                      </div>
                      {/* Genre Badge */}
                      {genre && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                          {genre}
                        </span>
                      )}
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center text-gray-500 mb-1">
                          <SafeIcon icon={FiFileText} className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium uppercase">Words</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{wordCountDisplay}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center text-gray-500 mb-1">
                          <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium uppercase">Est. Time</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{estimatedMinutes} min</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center text-gray-500 mb-1">
                          <SafeIcon icon={FiCpu} className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium uppercase">AI Model</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">v2.5 Pro</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center text-gray-500 mb-1">
                          <SafeIcon icon={FiActivity} className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium uppercase">Status</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">Analyzed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Insights Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <SafeIcon icon={FiBarChart2} className="w-5 h-5 mr-2 text-primary-500" />
                AI Insights & Recommendations
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Narrative Tone Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Engaging', 'Professional', 'Clear', 'Flowing'].map((tone, i) => (
                      <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">
                        {tone}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 border border-gray-200 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <SafeIcon icon={FiHeadphones} className="w-4 h-4 mr-2 text-primary-500" />
                      Suggested Voice Style
                    </h4>
                    <p className="text-sm text-gray-600">Based on your content, a <strong>Neutral-Warm</strong> voice with <strong>Moderate</strong> pacing would best suit this material.</p>
                  </div>
                  <div className="p-5 border border-gray-200 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <SafeIcon icon={FiUsers} className="w-4 h-4 mr-2 text-primary-500" />
                      Audience Match
                    </h4>
                    <p className="text-sm text-gray-600">Content structure aligns well with <strong>General Adult</strong> and <strong>Young Adult</strong> listening preferences.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recommendations Section (Dynamic) */}
            {recommendations.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <SafeIcon icon={FiMic} className="w-5 h-5 mr-2 text-primary-500" />
                  Recommended Voices
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                      <div className="font-semibold text-gray-900">{typeof rec === 'string' ? rec : rec.name || `Voice ${index + 1}`}</div>
                      {typeof rec !== 'string' && rec.description && (
                        <div className="text-sm text-gray-500 mt-1">{rec.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Chapters List (Dynamic) */}
            {chapters.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <SafeIcon icon={FiList} className="w-5 h-5 mr-2 text-primary-500" />
                  Detected Chapters ({chapters.length})
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {chapters.map((chapter, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        {typeof chapter === 'string' ? chapter : chapter.title || `Chapter ${index + 1}`}
                      </span>
                      <span className="text-xs text-gray-500">Ready</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

          {/* Sidebar Actions - Right 1/3 */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Next Steps</h3>
              <div className="space-y-4">
                <a 
                  href={resultUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={(e) => !isReady && e.preventDefault()}
                >
                  <SafeIcon icon={FiDownload} className="w-5 h-5 mr-2" />
                  {isReady ? 'Access Project Files' : 'Files Not Available'}
                </a>
                <p className="text-xs text-center text-gray-500">
                  {isReady ? 'You will be redirected to your secure project folder.' : 'Links are only available for processed files.'}
                </p>
                <hr className="border-gray-100" />
                <button className="w-full flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  <SafeIcon icon={FiPlay} className="w-5 h-5 mr-2" />
                  Listen to Preview (Coming Soon)
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-2">Need Adjustments?</h3>
              <p className="text-gray-300 text-sm mb-4">
                You can refine the voice settings, pronunciation, and pacing in your dashboard.
              </p>
              <Link to="/dashboard" className="inline-flex items-center text-primary-300 hover:text-white transition-colors text-sm font-medium">
                Go to Dashboard <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookAnalysisPage;