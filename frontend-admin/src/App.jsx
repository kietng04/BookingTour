import { Route, Routes } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TourList from './pages/Tours/TourList.jsx';
import TourDetail from './pages/Tours/TourDetail.jsx';
import TourCreate from './pages/Tours/TourCreate.jsx';
import TourEdit from './pages/Tours/TourEdit.jsx';
import DepartureList from './pages/Departures/DepartureList.jsx';
import DepartureDetail from './pages/Departures/DepartureDetail.jsx';
import DepartureCreate from './pages/Departures/DepartureCreate.jsx';
import DepartureEdit from './pages/Departures/DepartureEdit.jsx';
import BookingList from './pages/Bookings/BookingList.jsx';
import BookingDetail from './pages/Bookings/BookingDetail.jsx';
import CustomTourList from './pages/CustomTours/CustomTourList.jsx';
import UserList from './pages/Users/UserList.jsx';
// import ReviewList from './pages/Reviews/ReviewList.jsx';
import Login from './pages/Login.jsx';
import AdminOAuthCallback from './pages/AdminOAuthCallback.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';

const App = () => (
  <AdminAuthProvider>
    <ToastProvider>
      <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/callback" element={<AdminOAuthCallback />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="/tours" element={<TourList />} />
        <Route
          path="/tours/new"
          element={
            <ProtectedRoute requiredPermissions={['TOUR_CREATE']}>
              <TourCreate />
            </ProtectedRoute>
          }
        />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route
          path="/tours/:id/edit"
          element={
            <ProtectedRoute requiredPermissions={['TOUR_UPDATE']}>
              <TourEdit />
            </ProtectedRoute>
          }
        />
        <Route path="/departures" element={<DepartureList />} />
        <Route path="/departures/new" element={<DepartureCreate />} />
        <Route path="/departures/:departureId" element={<DepartureDetail />} />
        <Route path="/departures/:departureId/edit" element={<DepartureEdit />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/bookings/:bookingId" element={<BookingDetail />} />
        <Route path="/custom-tours" element={<CustomTourList />} />
        {/* Review route disabled - not in use */}
        {/* <Route path="/reviews" element={<ReviewList />} /> */}
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <UserList />
            </ProtectedRoute>
          }
        />
      </Route>
      </Routes>
    </ToastProvider>
  </AdminAuthProvider>
);

export default App;
