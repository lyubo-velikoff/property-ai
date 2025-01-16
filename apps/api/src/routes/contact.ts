import { Router, Response, Request } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { protect, restrictTo } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { 
  ApiSuccessResponse, 
  ApiErrorResponse,
  ApiErrorCode,
  ContactMessage, 
  ContactMessageResponse, 
  ContactMessagesResponse,
  UserRole
} from '@avalon/shared-types';

const router: Router = Router();

const createMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

const mapContactMessage = (message: any): ContactMessage => ({
  id: message.id,
  name: message.name,
  email: message.email,
  message: message.message,
  isRead: message.isRead,
  createdAt: message.createdAt.toISOString(),
  updatedAt: message.updatedAt.toISOString(),
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
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = createMessageSchema.parse(req.body);

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
router.get('/messages', protect, restrictTo(UserRole.ADMIN), async (req: Request, res: Response) => {
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

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;

    const response: ApiSuccessResponse<ContactMessagesResponse> = {
      status: 'success',
      data: {
        data: messages.map(mapContactMessage),
        meta: {
          total,
          page,
          pageSize: limit,
          totalPages,
          hasNextPage,
          hasPreviousPage: page > 1,
        },
      }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Mark message as read (admin only)
router.patch('/messages/:id/read', protect, restrictTo(UserRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.update({
      where: { id: String(id) },
      data: { isRead: true },
    });

    if (!message) {
      throw new AppError('Message not found', 404);
    }

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
router.delete('/messages/:id', protect, restrictTo(UserRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.contactMessage.delete({
      where: { id: String(id) },
    });

    const response: ApiSuccessResponse<null> = {
      status: 'success',
      data: null,
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

export const contactRoutes = router; 
