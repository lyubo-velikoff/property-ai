import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../types/api';
import { getCurrentUser, login as loginApi, register as registerApi, logout as logoutApi } from '../services/auth';
import type { LoginData, RegisterData } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  // Initial auth check
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const handleLogin = async (credentials: LoginData): Promise<void> => {
    try {
      const response = await loginApi(credentials);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      // Get the redirect path from location state or default to /admin
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const handleRegister = async (data: RegisterData): Promise<void> => {
    try {
      const response = await registerApi(data);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      navigate('/');
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const handleLogout = () => {
    logoutApi();
    localStorage.removeItem('token');
    setUser(null);
    navigate('/admin/login');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
