import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

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

      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      return response.json();
    },
    retry: false,
    enabled: !!token,
  });

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 
