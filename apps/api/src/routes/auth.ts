import { Router, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/error';
import { protect } from '../middleware/auth';
import { 
  ApiSuccessResponse, 
  ApiErrorResponse,
  ApiErrorCode,
  RegisterInput,
  LoginInput,
  AuthResponse,
  MeResponse,
  UserRole,
  User
} from '@avalon/shared-types';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}) satisfies z.ZodType<RegisterInput>;

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}) satisfies z.ZodType<LoginInput>;

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

// Register
router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(400, 'User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: UserRole.USER
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
    });

    // Create token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    const response: ApiSuccessResponse<AuthResponse> = {
      status: 'success',
      data: { 
        user: mapUserToResponse(user),
        token 
      }
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        createdAt: true
      }
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Create token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const response: ApiSuccessResponse<AuthResponse> = {
      status: 'success',
      data: { 
        user: mapUserToResponse(userWithoutPassword),
        token 
      }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  const response: ApiSuccessResponse<MeResponse> = {
    status: 'success',
    data: { user: req.user as User }
  };

  res.json(response);
});

export const authRoutes = router; 
