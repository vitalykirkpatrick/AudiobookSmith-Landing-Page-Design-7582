import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import database from '../../lib/database';
import ProfileSettings from './ProfileSettings';
import BookManagement from './BookManagement';
import PlanDetails from './PlanDetails';

const { FiUser, FiBook, FiCreditCard, FiLogOut, FiBell } = FiIcons;

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userEmail = localStorage.getItem('user_email');
      if (!userEmail) {
        window.location.href = '/login';
        return;
      }

      const { data: userData } = await database.select('users_audiobooksmith', {
        email: userEmail
      });

      const { data: booksData } = await database.select('user_books', {
        user_email: userEmail
      });

      if (userData && userData.length > 0) {
        setUser(userData[0]);
      }
      setBooks(booksData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_email');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AS</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">AudiobookSmith</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                <SafeIcon icon={FiLogOut} className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-primary-100">
            Manage your audiobook projects and account settings here. 
            Your books will be processed on our main platform at{' '}
            <a href="https://audiobooksmith.app" className="underline font-medium">
              audiobooksmith.app
            </a>
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <nav className="flex space-x-4 p-4">
            {[
              { id: 'books', label: 'My Books', icon: FiBook },
              { id: 'profile', label: 'Profile Settings', icon: FiUser },
              { id: 'plan', label: 'Plan & Billing', icon: FiCreditCard }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'books' && (
            <BookManagement 
              user={user} 
              books={books} 
              onBooksUpdate={loadUserData} 
            />
          )}
          {activeTab === 'profile' && (
            <ProfileSettings 
              user={user} 
              onUserUpdate={loadUserData} 
            />
          )}
          {activeTab === 'plan' && (
            <PlanDetails 
              user={user} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;