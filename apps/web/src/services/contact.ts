import api from '../lib/api';
import type { ApiResponse, ContactMessage, PaginatedResponse } from '../types/api';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface MessageFilters {
  page?: number;
  limit?: number;
}

export const submitContactForm = async (data: ContactFormData): Promise<ContactMessage> => {
  const response = await api.post<ApiResponse<{ message: ContactMessage }>>('/contact', data);
  return response.data.data.message;
};

export const getMessages = async (filters: MessageFilters = {}): Promise<PaginatedResponse<ContactMessage>> => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await api.get<ApiResponse<PaginatedResponse<ContactMessage>>>(`/contact/messages?${params}`);
  return response.data.data;
};

export const markMessageAsRead = async (id: string): Promise<ContactMessage> => {
  const response = await api.patch<ApiResponse<{ message: ContactMessage }>>(`/contact/messages/${id}/read`);
  return response.data.data.message;
};

export const deleteMessage = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/contact/messages/${id}`);
}; 
