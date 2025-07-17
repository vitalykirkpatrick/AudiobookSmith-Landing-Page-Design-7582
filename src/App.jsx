import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SEOOptimizedLandingPage from './components/SEOOptimizedLandingPage';
import OnboardingPage from './components/OnboardingPage';
import LoginPage from './components/LoginPage';
import SignupForm from './components/SignupForm';
import AdminPanel from './components/AdminPanel/AdminPanel';
import AdminLogin from './components/Auth/AdminLogin';
import UserLogin from './components/Auth/UserLogin';
import UserDashboard from './components/UserDashboard/UserDashboard';
import VoiceSamplesPage from './components/VoiceSamplesPage';
import CompactVoiceCloning from './components/VoiceCloning/CompactVoiceCloning';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, type = 'user' }) => {
  const token = localStorage.getItem(`${type}_token`);
  
  if (!token) {
    return <Navigate to={type === 'admin' ? '/admin/login' : '/login'} replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="App min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SEOOptimizedLandingPage />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/voice-samples" element={<VoiceSamplesPage />} />
            <Route path="/voice-cloning" element={<CompactVoiceCloning />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected User Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute type="user">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute type="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;