import api from '../lib/api';
import type { ApiSuccessResponse, ContactMessage, ContactMessageResponse, ContactMessagesResponse } from '@avalon/shared-types';

export async function getMessages(page = 1, limit = 10) {
  const response = await api.get<ApiSuccessResponse<ContactMessagesResponse>>(`/contact/messages?page=${page}&limit=${limit}`);
  return response;
}

export async function markMessageAsRead(id: string) {
  const response = await api.patch<ApiSuccessResponse<ContactMessageResponse>>(`/contact/messages/${id}/read`);
  return response;
}

export async function deleteMessage(id: string) {
  const response = await api.delete<ApiSuccessResponse<null>>(`/contact/messages/${id}`);
  return response;
} 
