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

  // Initial auth check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const verifyAuth = async () => {
      try {
        console.log('Verifying authentication...');
        const userData = await getCurrentUser();
        console.log('User data received:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Auth verification failed:', error);
        // Clear both token and user on auth error
        localStorage.removeItem('token');
        setUser(null);
        // Redirect to login if we're on an admin page
        if (window.location.pathname.startsWith('/admin')) {
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  const login = async (data: LoginData) => {
    try {
      console.log('Logging in...');
      const response = await loginApi(data);
      console.log('Login successful:', response);
      
      // Set token first
      localStorage.setItem('token', response.token);
      // Then update user state
      setUser(response.user);
      navigate('/admin');
    } catch (error) {
      console.error('Login failed:', error);
      // Clear any existing token on login failure
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
      // Set token first
      localStorage.setItem('token', response.token);
      // Then update user state
      setUser(response.user);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      // Clear any existing token on registration failure
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out...');
    logoutApi();
    // Clear both token and user
    localStorage.removeItem('token');
    setUser(null);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
