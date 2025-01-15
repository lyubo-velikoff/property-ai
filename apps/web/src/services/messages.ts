import api from '../lib/api';
import type { ContactMessage } from '@avalon/shared-types';

interface MessagesResponse {
  success: boolean;
  data: {
    items: ContactMessage[];
    total: number;
    page: number;
    pages: number;
    hasNextPage: boolean;
  };
}

interface MessageResponse {
  success: boolean;
  data: {
    message: ContactMessage;
  };
}

interface DeleteMessageResponse {
  success: boolean;
  data: null;
}

export async function getMessages(page = 1, limit = 10) {
  const response = await api.get<MessagesResponse>(`/contact/messages?page=${page}&limit=${limit}`);
  return response.data;
}

export async function markMessageAsRead(id: string) {
  const response = await api.patch<MessageResponse>(`/contact/messages/${id}/read`);
  return response.data;
}

export async function deleteMessage(id: string) {
  const response = await api.delete<DeleteMessageResponse>(`/contact/messages/${id}`);
  return response.data;
} 
