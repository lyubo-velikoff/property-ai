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
  const { user, isLoading: authLoading, setUser } = useAuth();

  const { isLoading: queryLoading, isError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage');
        throw new Error('No token');
      }
      
      try {
        console.log('Fetching user data...');
        const response = await api.get('/auth/me');
        const userData = response.data.data.user;
        console.log('User data received:', userData);
        setUser(userData);
        return userData;
      } catch (err) {
        console.error('Error in /auth/me request:', err);
        // Clear auth state on error
        localStorage.removeItem('token');
        setUser(null);
        throw err;
      }
    },
    retry: false,
    // Only run the query if we don't have a user already
    enabled: !user && !!localStorage.getItem('token'),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Show loading state while checking auth
  if (authLoading || queryLoading) {
    return <LoadingSpinner />;
  }

  // If no token exists, redirect to login
  if (!localStorage.getItem('token')) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If we have an error or no user after loading, redirect to login
  if (isError || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check admin access if required
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 
