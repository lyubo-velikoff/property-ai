import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { protect, restrictTo } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { 
  ApiSuccessResponse, 
  ApiErrorResponse,
  ApiErrorCode,
  UserRole,
  User,
  UsersResponse,
  UserResponse,
  CreateUserInput,
  UpdateUserInput
} from '@avalon/shared-types';

const router = Router();

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
}) satisfies z.ZodType<CreateUserInput>;

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

const mapUser = (user: { id: string; name: string; email: string; role: string; createdAt: Date }): User => ({
  ...user,
  role: user.role as UserRole,
  createdAt: user.createdAt.toISOString()
});

// Get all users (admin only)
router.get('/', protect, restrictTo(UserRole.ADMIN), async (req, res: Response) => {
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
        users: users.map(mapUser),
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

// Get single user (admin only)
router.get('/:id', protect, restrictTo(UserRole.ADMIN), async (req, res: Response) => {
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
      data: { user: mapUser(user) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Create user (admin only)
router.post('/', protect, restrictTo(UserRole.ADMIN), async (req, res: Response) => {
  try {
    const data = userSchema.parse(req.body);

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
      data: { user: mapUser(user) }
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Update user (admin only)
router.patch('/:id', protect, restrictTo(UserRole.ADMIN), async (req, res: Response) => {
  try {
    const data = userSchema.partial().parse(req.body) as UpdateUserInput;

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
      data: { user: mapUser(user) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Delete user (admin only)
router.delete('/:id', protect, restrictTo(UserRole.ADMIN), async (req, res: Response) => {
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
