import api from '../lib/api';
import type { ApiResponse, User, PaginatedResponse } from '../types/api';

export interface UserFilters {
  page?: number;
  limit?: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'USER';
}

export const getUsers = async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await api.get<ApiResponse<PaginatedResponse<User>>>(`/users?${params}`);
  return response.data.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
  return response.data.data.user;
};

export const createUser = async (data: CreateUserData): Promise<User> => {
  const response = await api.post<ApiResponse<{ user: User }>>('/users', data);
  return response.data.data.user;
};

export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  const response = await api.patch<ApiResponse<{ user: User }>>(`/users/${id}`, data);
  return response.data.data.user;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/users/${id}`);
}; 
