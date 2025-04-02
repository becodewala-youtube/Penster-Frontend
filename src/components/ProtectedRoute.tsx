import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSkeleton from './ProfileSkeleton';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  redirectPath = '/login'
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <ProfileSkeleton/>;
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;