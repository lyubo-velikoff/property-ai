import { Router } from 'express';
import { ContactFormSchema, type ContactFormResponse } from '../types/contact.js';
import { sendContactEmail } from '../lib/contact.js';
import { AppError } from '../middleware/error.js';
import { contactFormLimiter } from '../middleware/rateLimiter.js';
import logger from '../lib/logger.js';

const router = Router();

router.post('/', contactFormLimiter, async (req, res, next) => {
  try {
    logger.info('Contact form submission received', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Validate request body
    const result = ContactFormSchema.safeParse(req.body);
    if (!result.success) {
      logger.warn('Invalid contact form data', {
        errors: result.error.errors,
        ip: req.ip,
      });
      throw new AppError(400, 'Invalid form data');
    }

    // Send contact email
    await sendContactEmail(result.data);

    logger.info('Contact form processed successfully', {
      email: result.data.email,
      name: result.data.name,
    });

    const response: ContactFormResponse = {
      success: true,
      message: 'Message sent successfully',
    };

    res.json(response);
  } catch (error) {
    logger.error('Contact form submission failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip,
    });
    next(error);
  }
});

export default router; 
