import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user?.role?.name !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check permission if required
  if (requiredPermission && user?.role?.permissions) {
    const [resource, action] = requiredPermission;
    const hasPermission = user.role.permissions[resource]?.includes(action);
    if (!hasPermission) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
