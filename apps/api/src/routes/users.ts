import { Router, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { protect, restrictTo } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { 
  ApiSuccessResponse, 
  ApiErrorResponse,
  type UserRole,
  type User,
  type UsersResponse,
  type UserResponse,
  ApiErrorCode 
} from '@avalon/shared-types';
import { USER_ROLES } from '../constants/roles';

const router = Router();

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'USER'] as const).default('USER'),
});

const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['ADMIN', 'USER'] as const).optional(),
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

const mapUserToResponse = (user: { 
  id: string; 
  name: string; 
  email: string; 
  role: string;
  createdAt: Date;
}): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role as UserRole,
  createdAt: user.createdAt.toISOString()
});

// Get all users
router.get('/', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    const response: ApiSuccessResponse<UsersResponse> = {
      status: 'success',
      data: {
        users: users.map(mapUserToResponse),
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

// Get single user
router.get('/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const response: ApiSuccessResponse<UserResponse> = {
      status: 'success',
      data: { user: mapUserToResponse(user) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Create user
router.post('/', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const data = createUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(400, 'User already exists');
    }

    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const response: ApiSuccessResponse<UserResponse> = {
      status: 'success',
      data: { user: mapUserToResponse(user) }
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Update user
router.patch('/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const data = updateUserSchema.parse(req.body);

    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id: req.params.id },
        },
      });

      if (existingUser) {
        throw new AppError(400, 'Email already in use');
      }
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const response: ApiSuccessResponse<UserResponse> = {
      status: 'success',
      data: { user: mapUserToResponse(user) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Delete user
router.delete('/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    });

    const response: ApiSuccessResponse<null> = {
      status: 'success',
      data: null
    };

    res.status(204).json(response);
  } catch (error) {
    handleError(error, res);
  }
});

export const userRoutes = router; 
