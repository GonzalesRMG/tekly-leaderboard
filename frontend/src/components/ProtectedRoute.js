import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole = 'admin' }) {
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const location = useLocation();

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return children;
}

export default ProtectedRoute;