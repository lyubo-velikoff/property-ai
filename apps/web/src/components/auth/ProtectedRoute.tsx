import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../contexts/auth';
import LoadingSpinner from '../LoadingSpinner';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = true }: Props) {
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  // Show loading state while checking auth
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // If no token exists, redirect to login
  if (!localStorage.getItem('token')) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If no user after loading, redirect to login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check admin access if required
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 
