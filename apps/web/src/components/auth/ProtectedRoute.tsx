import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (!token) throw new Error('No token');
      const response = await api.get('/auth/me');
      console.log('Full API Response:', response);
      console.log('Response data:', response.data);
      return response.data.user;
    },
    retry: false,
    enabled: !!token,
  });

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-b-2 border-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !user) {
    localStorage.removeItem('token');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 
