import nodemailer from 'nodemailer';
import { ContactFormData } from '../types/contact';
import { AppError } from '../middleware/error';

// Configure nodemailer with environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY || '',
        response: token,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}

export async function sendContactEmail(formData: ContactFormData & { recaptchaToken?: string }): Promise<void> {
  const { name, email, message } = formData;

  // Verify reCAPTCHA token if provided
  if (formData.recaptchaToken) {
    const isValidRecaptcha = await verifyRecaptcha(formData.recaptchaToken);
    if (!isValidRecaptcha) {
      throw new AppError(400, 'reCAPTCHA verification failed');
    }
  }

  try {
    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Thank you for contacting us',
      html: `
        <h2>Thank you for contacting us</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>The Property AI Team</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new AppError(500, 'Failed to send email');
  }
} 
