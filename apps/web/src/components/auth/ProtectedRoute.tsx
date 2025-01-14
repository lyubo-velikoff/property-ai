import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../contexts/auth';
import LoadingSpinner from '../LoadingSpinner';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const { setUser } = useAuth();

  const { isLoading, isError, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      
      try {
        const response = await api.get('/auth/me');
        const user = response.data.user;
        setUser(user);
        return user;
      } catch (err) {
        console.error('Error in /auth/me request:', err);
        throw err;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 
