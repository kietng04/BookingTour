import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OAuth2Callback from './pages/OAuth2Callback';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ToursPageExplore from './pages/ToursPageExplore';
import TourDetailPage from './pages/TourDetailPage';
import BookingPage from './pages/BookingPage';
import PaymentResultPage from './pages/PaymentResultPage';
import NotFoundPage from './pages/NotFoundPage';
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
            <Route path="/payment-result" element={<PaymentResultPage />} />
            <Route path="/destinations" element={<PlaceholderPage title="Destinations coming soon" />} />
            <Route path="/experiences" element={<PlaceholderPage title="Unique experiences coming soon" />} />
            <Route path="/stories" element={<PlaceholderPage title="Travel stories coming soon" />} />
            <Route path="/support" element={<PlaceholderPage title="Support center" description="Chat with our travel concierge or browse FAQs while we finish this space." />} />
            <Route path="/auth/callback" element={<OAuth2Callback />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <SiteFooter />
      </div>
    </Router>
  );
};

export default App;
