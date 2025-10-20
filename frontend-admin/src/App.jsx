import { Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TourList from './pages/Tours/TourList.jsx';
import TourCreate from './pages/Tours/TourCreate.jsx';
import TourEdit from './pages/Tours/TourEdit.jsx';
import DepartureList from './pages/Departures/DepartureList.jsx';
import DepartureDetail from './pages/Departures/DepartureDetail.jsx';
import BookingList from './pages/Bookings/BookingList.jsx';
import BookingDetail from './pages/Bookings/BookingDetail.jsx';
import UserList from './pages/Users/UserList.jsx';
import Reviews from './pages/Reviews/Reviews.jsx';
import Settings from './pages/Settings/Settings.jsx';
import Login from './pages/Login.jsx';

const App = () => (
  <Routes>
    <Route path="/auth/login" element={<Login />} />
    <Route element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="/tours" element={<TourList />} />
      <Route path="/tours/new" element={<TourCreate />} />
      <Route path="/tours/:tourId" element={<TourEdit />} />
      <Route path="/departures" element={<DepartureList />} />
      <Route path="/departures/:departureId" element={<DepartureDetail />} />
      <Route path="/bookings" element={<BookingList />} />
      <Route path="/bookings/:bookingId" element={<BookingDetail />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
  </Routes>
);

export default App;
