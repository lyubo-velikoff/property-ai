import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

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

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (!token) throw new Error('No token');

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      const data = await response.json();
      return data.data.user;
    },
    retry: false,
    enabled: !!token,
  });

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
} 
