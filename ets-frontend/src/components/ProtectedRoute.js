import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If role is specified, check if user has that role
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;
