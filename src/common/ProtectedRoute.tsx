import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-pink"></div>
        </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};