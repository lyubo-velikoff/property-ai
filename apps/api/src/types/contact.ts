import { z } from 'zod';
import type { ContactMessage } from '@prisma/client';

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  recaptchaToken: z.string(),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export interface ContactFormResponse {
  success: boolean;
  message: string;
  data?: {
    message: ContactMessage;
  };
}

export interface MessagesResponse {
  success: boolean;
  data: {
    items: ContactMessage[];
    total: number;
    page: number;
    pages: number;
    hasNextPage: boolean;
  };
}

export interface MessageResponse {
  success: boolean;
  data: {
    message: ContactMessage;
  };
} 
