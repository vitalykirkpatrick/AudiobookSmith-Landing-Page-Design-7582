import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import database from '../../lib/database';
import { sendWebhook } from '../../utils/webhookService';

const { FiUpload, FiBook, FiTrash2, FiExternalLink, FiClock, FiCheck } = FiIcons;

const BookManagement = ({ user, books, onBooksUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'application/epub+zip'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOCX, DOC, TXT, or EPUB file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File size must be less than 50MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await database.uploadFile(file, 'manuscripts');
      
      if (uploadError) throw uploadError;

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create book record
      const bookData = {
        user_email: user.email,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        original_filename: file.name,
        file_url: uploadData.url,
        file_size: file.size,
        status: 'uploaded',
        uploaded_at: new Date().toISOString()
      };

      const { data: bookRecord } = await database.insert('user_books', bookData);

      // Send webhook to main app
      await sendWebhook('book.uploaded', {
        user: {
          email: user.email,
          name: user.name,
          username: user.email // Using email as username
        },
        book: {
          ...bookData,
          id: bookRecord.id
        }
      });

      // Update parent component
      onBooksUpdate();

      alert('Book uploaded successfully! It will be processed on audiobooksmith.app');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await database.delete('user_books', bookId);
        onBooksUpdate();
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete book');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploaded': return FiClock;
      case 'processing': return FiClock;
      case 'completed': return FiCheck;
      case 'failed': return FiTrash2;
      default: return FiBook;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
        <div className="text-sm text-gray-600">
          Books: {books.length} | Plan: {user?.plan || 'Free'}
        </div>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-8 text-center">
        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <div>
              <p className="text-gray-600">Uploading your book...</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div>
            <SafeIcon icon={FiUpload} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Manuscript</h3>
            <p className="text-gray-600 mb-4">
              Supported formats: PDF, DOCX, DOC, TXT, EPUB (Max 50MB)
            </p>
            <label className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer">
              <SafeIcon icon={FiUpload} className="w-5 h-5 mr-2" />
              Choose File
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc,.txt,.epub"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        )}
      </div>

      {/* Books List */}
      {books.length > 0 ? (
        <div className="space-y-4">
          {books.map(book => (
            <motion.div
              key={book.id}
              className="border border-gray-200 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={getStatusIcon(book.status)} className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.original_filename}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(book.status)}`}>
                        {book.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(book.file_size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(book.uploaded_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {book.status === 'completed' && (
                    <a
                      href="https://audiobooksmith.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 text-green-600 hover:text-green-800"
                      title="View on AudiobookSmith App"
                    >
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="flex items-center px-3 py-2 text-red-600 hover:text-red-800"
                    title="Delete Book"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {book.status === 'processing' && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Your book is being processed on audiobooksmith.app. You'll receive an email when it's ready.
                  </p>
                </div>
              )}
              
              {book.status === 'completed' && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Your audiobook is ready! Visit{' '}
                    <a 
                      href="https://audiobooksmith.app" 
                      className="underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      audiobooksmith.app
                    </a>{' '}
                    to download and manage your audiobook.
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <SafeIcon icon={FiBook} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books uploaded yet</h3>
          <p className="text-gray-600">
            Upload your first manuscript to get started with creating your audiobook.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Upload your manuscript here (PDF, DOCX, TXT, or EPUB)</li>
          <li>2. Your file is securely transferred to audiobooksmith.app</li>
          <li>3. Process your audiobook with AI voices on the main platform</li>
          <li>4. Download your finished audiobook when ready</li>
        </ol>
      </div>
    </div>
  );
};

export default BookManagement;