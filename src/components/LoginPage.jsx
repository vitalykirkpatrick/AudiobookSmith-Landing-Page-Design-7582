import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiUser, FiLock, FiMail, FiArrowLeft, FiAlertTriangle, FiEye, FiEyeOff } = FiIcons;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Redirect to dashboard or appropriate page after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;

      setResetSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const handleNavigateWithScroll = (path) => {
    navigate(path);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <button
            onClick={handleLogoClick}
            className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg mb-4 mx-auto hover:opacity-80 transition-opacity"
          >
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center relative">
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
                  <span className="text-[8px] font-extrabold text-primary-600">AS</span>
                </div>
              </div>
            </div>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isResetMode ? (resetSent ? 'Check Your Email' : 'Reset Password') : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isResetMode
              ? resetSent
                ? "We've sent you password reset instructions"
                : 'Enter your email to receive a password reset link'
              : 'Login to access your audiobook projects'}
          </p>
        </div>

        <motion.div
          className="bg-white rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 flex items-start">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {resetSent ? (
            <div className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiMail} className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-gray-600 mb-6">
                  If an account exists with <strong>{email}</strong>, you'll receive an email with instructions to reset your password.
                </p>
                <button
                  onClick={() => {
                    setIsResetMode(false);
                    setResetSent(false);
                  }}
                  className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Return to Login
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={isResetMode ? handleResetPassword : handleLogin} className="p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {!isResetMode && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SafeIcon icon={FiLock} className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!isResetMode && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary-600 hover:text-primary-800"
                    onClick={() => setIsResetMode(true)}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>{isResetMode ? 'Send Reset Link' : 'Login'}</>
                  )}
                </button>
              </div>

              {isResetMode && (
                <button
                  type="button"
                  className="w-full mt-4 py-2 text-primary-600 font-medium flex items-center justify-center hover:text-primary-800 transition-colors"
                  onClick={() => setIsResetMode(false)}
                >
                  <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
                  Back to Login
                </button>
              )}
            </form>
          )}

          <div className="px-8 pb-8 pt-0 text-center">
            <div className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => handleNavigateWithScroll('/signup')}
                className="text-primary-600 font-medium hover:text-primary-800"
              >
                Sign up here
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;