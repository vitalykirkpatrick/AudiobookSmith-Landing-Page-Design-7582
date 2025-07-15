import React from 'react';
import {HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import SEOOptimizedLandingPage from './components/SEOOptimizedLandingPage';
import OnboardingPage from './components/OnboardingPage';
import LoginPage from './components/LoginPage';
import SignupForm from './components/SignupForm';
import AdminDashboard from './components/AdminDashboard';
import VoiceSamplesPage from './components/VoiceSamplesPage';
import CompactVoiceCloning from './components/VoiceCloning/CompactVoiceCloning';
import './App.css';

// Admin credentials for testing
const ADMIN_CREDENTIALS = {
  email: 'admin@audiobooksmith.com',
  password: 'admin123'
};

// Demo user credentials
const DEMO_CREDENTIALS = {
  email: 'demo@audiobooksmith.com',
  password: 'demo123'
};

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="App min-h-screen">
          <Routes>
            <Route path="/" element={<SEOOptimizedLandingPage />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/voice-samples" element={<VoiceSamplesPage />} />
            <Route path="/voice-cloning" element={<CompactVoiceCloning />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;