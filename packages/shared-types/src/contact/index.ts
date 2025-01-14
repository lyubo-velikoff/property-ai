import { PaginationParams, PaginatedResponse } from '../common/pagination';

/**
 * Contact message
 */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contact message creation input
 */
export interface CreateContactMessageInput {
  name: string;
  email: string;
  message: string;
}

/**
 * Contact message response
 */
export interface ContactMessageResponse {
  message: ContactMessage;
}

/**
 * Contact messages list response
 */
export interface ContactMessagesResponse extends PaginatedResponse<ContactMessage> {} 
