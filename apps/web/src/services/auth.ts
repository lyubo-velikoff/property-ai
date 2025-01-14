import api from '../lib/api';
import type { ApiResponse, AuthResponse, User } from '../types/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<{ user: User; token: string }>('/auth/login', data);
  console.log('Raw API Response:', response);
  console.log('Response data:', response.data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
  return response.data.data;
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<{ user: User }>('/auth/me');
    console.log('Get current user response:', response);
    return response.data.user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/admin/login';
}; 
