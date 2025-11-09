import { Route, Routes } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
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
import Settings from './pages/Settings/Settings.jsx';
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
        <Route
          path="/tours/:tourId"
          element={
            <ProtectedRoute requiredPermissions={['TOUR_UPDATE']}>
              <TourEdit />
            </ProtectedRoute>
          }
        />
        <Route path="/departures" element={<DepartureList />} />
        <Route path="/departures/:departureId" element={<DepartureDetail />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/bookings/:bookingId" element={<BookingDetail />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <UserList />
            </ProtectedRoute>
          }
        />
        { /* Reviews tạm gỡ bỏ: chuyển sang dữ liệu thật sau */ }
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredRole="SUPER_ADMIN">
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>
      </Routes>
    </ToastProvider>
  </AdminAuthProvider>
);

export default App;
