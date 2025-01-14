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
  const response = await api.post<{ status: string; data: AuthResponse }>('/auth/login', data);
  const { token, user } = response.data.data;
  localStorage.setItem('token', token);
  return { token, user };
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
  const { token, user } = response.data.data;
  localStorage.setItem('token', token);
  return { token, user };
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
  return response.data.data.user;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
}; 
