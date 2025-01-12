import { Router } from 'express';
import { ContactFormSchema, type ContactFormResponse } from '../types/contact.js';
import { sendContactEmail } from '../lib/contact.js';
import { AppError } from '../middleware/error.js';
import { contactFormLimiter } from '../middleware/rateLimiter.js';
import logger from '../lib/logger.js';
import { protect, restrictTo } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

const router = Router();

// Submit contact form
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

    // Save message to database
    const message = await prisma.contactMessage.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        message: result.data.message,
      },
    });

    // Send contact email
    await sendContactEmail(result.data);

    logger.info('Contact form processed successfully', {
      email: result.data.email,
      name: result.data.name,
    });

    const response: ContactFormResponse = {
      success: true,
      message: 'Message sent successfully',
      data: { message },
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

// Get all messages (admin only)
router.get('/messages', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count(),
    ]);

    res.json({
      success: true,
      data: {
        items: messages,
        total,
        page,
        pages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Mark message as read (admin only)
router.patch('/messages/:id/read', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({
      success: true,
      data: { message },
    });
  } catch (error) {
    next(error);
  }
});

// Delete message (admin only)
router.delete('/messages/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.contactMessage.delete({
      where: { id },
    });

    res.json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

export default router; 
