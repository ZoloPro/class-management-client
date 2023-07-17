import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

const ProtectedRoute = ({ role, children }) => {
  const { isAuthenticated, userRole } = useAuth();

  return isAuthenticated && userRole === role ? (
    children
  ) : (
    <Navigate to={`${role === 'admin' ? '/admin/login' : '/login'}`} />
  );
};

export default ProtectedRoute;
