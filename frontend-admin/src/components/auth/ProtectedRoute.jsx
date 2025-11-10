import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const ProtectedRoute = ({
  children,
  requiredPermissions = [],
  requiredRole,
  redirectTo = '/auth/login'
}) => {
  const {
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    hasPermission,
    isSessionExpired,
    updateLastActivity
  } = useAdminAuth();

  const location = useLocation();

  // Avoid calling setState during render; update activity after mount
  // via a layout effect to prevent render loops
  React.useEffect(() => {
    updateLastActivity();
  }, [updateLastActivity]);

  // Check if session is expired
  if (isSessionExpired()) {
    console.warn('Session expired, redirecting to login');
    return <Navigate to={redirectTo} state={{ from: location.pathname, reason: 'session_expired' }} replace />;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Check role requirements
  if (requiredRole) {
    if (requiredRole === 'SUPER_ADMIN' && !isSuperAdmin) {
      return <Navigate to="/unauthorized" state={{ reason: 'insufficient_role' }} replace />;
    }
    if (requiredRole === 'ADMIN' && !isAdmin) {
      return <Navigate to="/unauthorized" state={{ reason: 'insufficient_role' }} replace />;
    }
  }

  // Check if user is admin (basic requirement for all admin routes)
  if (!isAdmin) {
    return <Navigate to="/unauthorized" state={{ reason: 'not_admin' }} replace />;
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));
    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" state={{ reason: 'insufficient_permissions' }} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
