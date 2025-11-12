import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OAuth2Callback from './pages/OAuth2Callback';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import ToursPageExplore from './pages/ToursPageExplore';
import TourDetailPage from './pages/TourDetailPage';
import BookingPage from './pages/BookingPage.jsx';
import BookingHistory from './pages/BookingHistory.jsx';
import PaymentResultPage from './pages/PaymentResultPage';
import NotFoundPage from './pages/NotFoundPage';
import Profile from './pages/Profile';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import ScrollToTop from './components/layout/ScrollToTop';
import PlaceholderPage from './pages/PlaceholderPage';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-gray-25">
        <SiteHeader />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tours" element={<ToursPageExplore />} />
            <Route path="/tours/:slug" element={<TourDetailPage />} />
            <Route path="/booking/:slug" element={<BookingPage />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment-result" element={<PaymentResultPage />} />
            <Route path="/destinations" element={<PlaceholderPage title="Destinations coming soon" />} />
            <Route path="/auth/callback" element={<OAuth2Callback />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <SiteFooter />
      </div>
    </Router>
  );
};

export default App;
