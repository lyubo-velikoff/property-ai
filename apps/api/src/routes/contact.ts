import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { protect, restrictTo } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { 
  ApiSuccessResponse, 
  ApiErrorResponse,
  ApiErrorCode,
  CreateContactMessageInput,
  ContactMessageResponse,
  ContactMessagesResponse,
  UserRole,
  ContactMessage
} from '@avalon/shared-types';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
}) satisfies z.ZodType<CreateContactMessageInput>;

const mapContactMessage = (message: {
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

// Create contact message
router.post('/', async (req, res: Response, next) => {
  try {
    const data = contactSchema.parse(req.body);

    const message = await prisma.contactMessage.create({
      data
    });

    const response: ApiSuccessResponse<ContactMessageResponse> = {
      status: 'success',
      data: { message: mapContactMessage(message) }
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Get all messages (admin only)
router.get('/messages', protect, restrictTo(UserRole.ADMIN), async (req, res: Response, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count(),
    ]);

    const response: ApiSuccessResponse<ContactMessagesResponse> = {
      status: 'success',
      data: {
        data: messages.map(mapContactMessage),
        meta: {
          total,
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: skip + limit < total,
          hasPreviousPage: page > 1
        }
      }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Mark message as read (admin only)
router.patch('/messages/:id/read', protect, restrictTo(UserRole.ADMIN), async (req, res: Response, next) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    const response: ApiSuccessResponse<ContactMessageResponse> = {
      status: 'success',
      data: { message: mapContactMessage(message) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Delete message (admin only)
router.delete('/messages/:id', protect, restrictTo(UserRole.ADMIN), async (req, res: Response, next) => {
  try {
    const { id } = req.params;

    await prisma.contactMessage.delete({
      where: { id },
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
