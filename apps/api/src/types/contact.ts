import { z } from 'zod';

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
} 
