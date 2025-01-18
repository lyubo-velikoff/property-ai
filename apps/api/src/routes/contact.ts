import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { protect, restrictTo } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { 
  ApiSuccessResponse, 
  ApiErrorResponse,
  type UserRole,
  type ContactMessage,
  type ContactMessagesResponse,
  type ContactMessageResponse,
  ApiErrorCode 
} from '@avalon/shared-types';
import { USER_ROLES } from '../constants/roles';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const handleError = (error: unknown, res: Response) => {
  if (error instanceof z.ZodError) {
    const response: ApiErrorResponse = {
      status: 'error',
      message: 'Invalid input data',
      code: ApiErrorCode.VALIDATION_ERROR,
      errors: error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = [err.message];
        return acc;
      }, {} as Record<string, string[]>)
    };
    res.status(400).json(response);
  } else if (error instanceof AppError) {
    const response: ApiErrorResponse = {
      status: 'error',
      message: error.message,
      code: error.statusCode === 404 ? ApiErrorCode.NOT_FOUND : ApiErrorCode.INTERNAL_ERROR
    };
    res.status(error.statusCode).json(response);
  } else {
    console.error(error);
    const response: ApiErrorResponse = {
      status: 'error',
      message: 'Internal server error',
      code: ApiErrorCode.INTERNAL_ERROR
    };
    res.status(500).json(response);
  }
};

const mapContactToResponse = (message: { 
  id: string; 
  name: string; 
  email: string; 
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ContactMessage => ({
  id: message.id,
  name: message.name,
  email: message.email,
  message: message.message,
  isRead: message.isRead,
  createdAt: message.createdAt.toISOString(),
  updatedAt: message.updatedAt.toISOString()
});

// Get all messages (admin only)
router.get('/', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contactMessage.count()
    ]);

    const response: ApiSuccessResponse<ContactMessagesResponse> = {
      status: 'success',
      data: {
        data: messages.map(mapContactToResponse),
        meta: {
          total,
          page: parseInt(page as string),
          pageSize: parseInt(limit as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          hasNextPage: skip + parseInt(limit as string) < total,
          hasPreviousPage: parseInt(page as string) > 1
        }
      }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Get single message (admin only)
router.get('/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: req.params.id }
    });

    if (!message) {
      throw new AppError('Message not found', '404');
    }

    const response: ApiSuccessResponse<ContactMessageResponse> = {
      status: 'success',
      data: { message: mapContactToResponse(message) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Create message (public)
router.post('/', async (req, res: Response) => {
  try {
    const data = contactSchema.parse(req.body);

    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message
      }
    });

    const response: ApiSuccessResponse<ContactMessageResponse> = {
      status: 'success',
      data: { message: mapContactToResponse(message) }
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Mark message as read (admin only)
router.patch('/:id/read', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });

    if (!message) {
      throw new AppError('Message not found', '404');
    }

    const response: ApiSuccessResponse<ContactMessageResponse> = {
      status: 'success',
      data: { message: mapContactToResponse(message) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Delete message (admin only)
router.delete('/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    await prisma.contactMessage.delete({
      where: { id: req.params.id }
    });

    const response: ApiSuccessResponse<null> = {
      status: 'success',
      data: null
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

export const contactRoutes = router; 
