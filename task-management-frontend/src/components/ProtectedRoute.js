/**
 * Protected Route - Restricts access based on permissions/roles
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRBAC } from '../hooks/useRBAC';
import { Box, Typography, Button } from '@mui/material';
import { Lock } from 'lucide-react';

/**
 * Route protection based on permission
 */
export const ProtectedRoute = ({ 
  children, 
  permission,
  fallback = <AccessDenied />
}) => {
  const { hasPermission, user, isAuthenticated, loading } = useRBAC();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (permission && !hasPermission(permission)) {
    return fallback;
  }
  
  return children;
};

/**
 * Route protection based on role
 */
export const RoleProtectedRoute = ({ 
  children, 
  role,
  requireAll = false,
  fallback = <AccessDenied />
}) => {
  const { hasRole, hasAnyRole, user, isAuthenticated, loading } = useRBAC();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  let hasAccess = false;
  
  if (Array.isArray(role)) {
    hasAccess = requireAll 
      ? role.every(r => hasRole(r))
      : hasAnyRole(role);
  } else {
    hasAccess = hasRole(role);
  }
  
  if (!hasAccess) {
    return fallback;
  }
  
  return children;
};

/**
 * Route protection for Super Admin only
 */
export const SuperAdminRoute = ({ 
  children, 
  fallback = <AccessDenied />
}) => {
  const { isSuperAdmin, user, isAuthenticated, loading } = useRBAC();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isSuperAdmin()) {
    return fallback;
  }
  
  return children;
};

/**
 * Route protection for Admin and above
 */
export const AdminRoute = ({ 
  children, 
  fallback = <AccessDenied />
}) => {
  const { isAdmin, isSuperAdmin, user, isAuthenticated, loading } = useRBAC();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin() && !isSuperAdmin()) {
    return fallback;
  }
  
  return children;
};

/**
 * Route protection for Manager and above
 */
export const ManagerRoute = ({ 
  children, 
  fallback = <AccessDenied />
}) => {
  const { isManager, isAdmin, isSuperAdmin, user, isAuthenticated, loading } = useRBAC();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isManager() && !isAdmin() && !isSuperAdmin()) {
    return fallback;
  }
  
  return children;
};

/**
 * Access Denied Component
 */
export const AccessDenied = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: 3,
      }}
    >
      <Lock size={64} style={{ color: '#FF6B6B', marginBottom: 16 }} />
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Access Denied
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 3 }}>
        You don't have permission to access this resource.
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => window.history.back()}
      >
        Go Back
      </Button>
    </Box>
  );
};

/**
 * Loading Screen Component
 */
export const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h6" color="textSecondary">
        Loading...
      </Typography>
    </Box>
  );
};

export default {
  ProtectedRoute,
  RoleProtectedRoute,
  SuperAdminRoute,
  AdminRoute,
  ManagerRoute,
  AccessDenied,
  LoadingScreen,
};
