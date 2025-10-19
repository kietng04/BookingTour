import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Tours from './pages/Tours.jsx';
import TourDetail from './pages/TourDetail.jsx';
import Booking from './pages/Booking.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PaymentStatus from './pages/PaymentStatus.jsx';
import Reviews from './pages/Reviews.jsx';

const App = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:tourId" element={<TourDetail />} />
      <Route path="/booking/:tourId" element={<Booking />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/payment/:status" element={<PaymentStatus />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </MainLayout>
);

export default App;
