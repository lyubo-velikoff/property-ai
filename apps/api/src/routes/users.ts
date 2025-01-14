import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { protect, restrictTo } from '../middleware/auth';
import { AppError } from '../middleware/error';

const router = Router();

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'USER']).default('USER'),
});

// Get all users (admin only)
router.get('/', protect, restrictTo('ADMIN'), async (req, res, next) => {
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

    res.json({
      status: 'success',
      data: {
        users,
        total,
        page: parseInt(page as string),
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single user (admin only)
router.get('/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
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

    res.json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Create user (admin only)
router.post('/', protect, restrictTo('ADMIN'), async (req, res, next) => {
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

    res.status(201).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Update user (admin only)
router.patch('/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const data = userSchema.partial().parse(req.body);

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

    res.json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Delete user (admin only)
router.delete('/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

export const userRoutes = router; 
