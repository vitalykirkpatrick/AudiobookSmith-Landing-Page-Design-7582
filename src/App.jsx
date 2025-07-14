import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SEOOptimizedLandingPage from './components/SEOOptimizedLandingPage';
import OnboardingPage from './components/OnboardingPage';
import LoginPage from './components/LoginPage';
import VoiceSamplesPage from './components/VoiceSamplesPage';
import VoiceCloning from './components/VoiceCloning';
import VoiceCloningEnhanced from './components/VoiceCloningEnhanced';
import VoiceCloningRedesigned from './components/VoiceCloningRedesigned';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SEOOptimizedLandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/voice-samples" element={<VoiceSamplesPage />} />
            <Route path="/voice-cloning" element={<VoiceCloningRedesigned />} />
            <Route path="/voice-cloning-classic" element={<VoiceCloning />} />
            <Route path="/voice-cloning-enhanced" element={<VoiceCloningEnhanced />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;