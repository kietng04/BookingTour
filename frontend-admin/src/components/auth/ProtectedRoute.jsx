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
    updateLastActivity
  } = useAdminAuth();

  const location = useLocation();

  React.useEffect(() => {
    updateLastActivity();
  }, [updateLastActivity]);

  // isAuthenticated already includes session expiry check
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  if (requiredRole) {
    if (requiredRole === 'SUPER_ADMIN' && !isSuperAdmin) {
      return <Navigate to="/unauthorized" state={{ reason: 'insufficient_role' }} replace />;
    }
    if (requiredRole === 'ADMIN' && !isAdmin) {
      return <Navigate to="/unauthorized" state={{ reason: 'insufficient_role' }} replace />;
    }
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" state={{ reason: 'not_admin' }} replace />;
  }

  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));
    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" state={{ reason: 'insufficient_permissions' }} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
