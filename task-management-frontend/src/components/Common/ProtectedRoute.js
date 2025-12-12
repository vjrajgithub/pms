import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions if required
  if (requiredPermission && user) {
    const [resource, action] = requiredPermission;
    const userPermissions = user.role?.permissions || {};
    
    if (!userPermissions[resource] || !userPermissions[resource].includes(action)) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          flexDirection="column"
        >
          <h2>Access Denied</h2>
          <p>You don't have permission to access this resource.</p>
        </Box>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
