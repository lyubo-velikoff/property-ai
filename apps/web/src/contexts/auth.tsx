import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authVerified, setAuthVerified] = useState(false);

  // Initial auth check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      setAuthVerified(true);
      return;
    }

    const verifyAuth = async () => {
      try {
        console.log('Verifying authentication...');
        const userData = await getCurrentUser();
        console.log('User data received:', userData);
        setUser(userData);
        
        // Only redirect if we haven't verified auth yet
        if (!authVerified && window.location.pathname === '/admin/login') {
          navigate('/admin');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('token');
        setUser(null);
        
        // Only redirect if we haven't verified auth yet
        if (!authVerified && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
        setAuthVerified(true);
      }
    };

    verifyAuth();
  }, [navigate, authVerified]);

  const login = async (data: LoginData) => {
    try {
      console.log('Logging in...');
      const response = await loginApi(data);
      console.log('Login successful:', response);
      
      // Set token first
      localStorage.setItem('token', response.token);
      // Then update user state
      setUser(response.user);
      // Reset auth verification flag
      setAuthVerified(false);
      navigate('/admin');
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log('Registering...');
      const response = await registerApi(data);
      console.log('Registration successful:', response);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      // Reset auth verification flag
      setAuthVerified(false);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out...');
    logoutApi();
    localStorage.removeItem('token');
    setUser(null);
    // Reset auth verification flag
    setAuthVerified(false);
    navigate('/admin/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      <div data-testid="auth-provider" data-user={JSON.stringify({ user })}>
        {children}
      </div>
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
