import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OAuth2Callback from './pages/OAuth2Callback';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/callback" element={<OAuth2Callback />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
