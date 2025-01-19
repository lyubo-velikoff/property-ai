import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import LoadingSpinner from '../LoadingSpinner';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = true }: Props) {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check admin access if required
  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 
