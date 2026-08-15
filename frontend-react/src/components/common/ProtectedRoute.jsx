import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className="spinner" style={{ width: 24, height: 24, border: '2px solid rgba(201,162,39,0.3)', borderTopColor: '#c9a227', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className="spinner" style={{ width: 24, height: 24, border: '2px solid rgba(201,162,39,0.3)', borderTopColor: '#c9a227', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span>Checking admin permissions...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
