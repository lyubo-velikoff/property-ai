import api from '../lib/api';
import type { User } from '@avalon/shared-types';

// The shape of data returned by the API
interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  pages: number;
}

interface UserResponse {
  user: User;
}

export async function getUsers(page: number, limit: number) {
  // The axios interceptor transforms response to be the data property from the API response
  return api.get<UsersResponse>(`/admin/users?page=${page}&limit=${limit}`);
}

export async function getUser(id: string): Promise<User> {
  const response = await api.get<UserResponse>(`/admin/users/${id}`);
  return response.data.user;
}

export async function createUser(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const response = await api.post<UserResponse>('/admin/users', data);
  return response.data.user;
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
  const response = await api.patch<UserResponse>(`/admin/users/${id}`, data);
  return response.data.user;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/admin/users/${id}`);
} 
