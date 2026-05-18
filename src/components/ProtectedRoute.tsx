import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show minimal loading only during initial check
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-natural-bg">
        <Loader2 className="animate-spin text-natural-olive" size={40} />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
