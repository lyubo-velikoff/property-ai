import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';
import { upload } from '../config/multer.js';
import { propertySchema } from './properties.js';

const router = Router();

// User schema for validation
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

// Get admin dashboard stats
router.get('/stats', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const [properties, messages, users] = await Promise.all([
      prisma.property.count(),
      prisma.contactMessage.count(),
      prisma.user.count(),
    ]);

    res.json({
      status: 'success',
      data: {
        properties,
        messages,
        users,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all properties (admin)
router.get('/properties', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.property.count(),
    ]);

    res.json({
      status: 'success',
      data: {
        properties,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single property (admin)
router.get('/properties/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        images: true,
        contact_info: true,
      },
    });

    if (!property) {
      throw new AppError(404, 'Property not found');
    }

    res.json({
      status: 'success',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
});

// Update property (admin only)
router.patch(
  '/properties/:id',
  protect,
  restrictTo('ADMIN'),
  upload.array('image', 20),
  async (req, res, next) => {
    try {
      const data = propertySchema.parse({
        ...req.body,
        contact_info: typeof req.body.contact_info === 'string' 
          ? JSON.parse(req.body.contact_info)
          : req.body.contact_info
      });
      const files = req.files as Express.Multer.File[];
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // Get the existing property to get the contact info ID
      const existingProperty = await prisma.property.findUnique({
        where: { id: req.params.id },
        include: { contact_info: true },
      });

      if (!existingProperty) {
        throw new AppError(404, 'Property not found');
      }

      // Update the property with the correct contact info reference
      const property = await prisma.property.update({
        where: { id: req.params.id },
        data: {
          ...data,
          contact_info: {
            update: {
              phone: data.contact_info.phone,
              email: data.contact_info.email,
            },
          },
          ...(files.length > 0 && {
            images: {
              deleteMany: {},
              create: files.map((file) => ({
                url: `${baseUrl}/uploads/properties/${file.filename}`,
              })),
            },
          }),
        },
        include: {
          images: true,
          contact_info: true,
        },
      });

      res.json({
        status: 'success',
        data: { property },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all users (admin)
router.get('/users', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    res.json({
      status: 'success',
      data: {
        users,
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single user (admin)
router.get('/users/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: String(req.params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Create user (admin)
router.post('/users', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const data = userSchema.parse(req.body);

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
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

// Update user (admin)
router.patch('/users/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const data = userSchema.partial().parse(req.body);

    // If email is being updated, check if it's already taken
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id: String(req.params.id) },
        },
      });

      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }
    }

    const user = await prisma.user.update({
      where: { id: String(req.params.id) },
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

// Delete user (admin)
router.delete('/users/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    await prisma.user.delete({
      where: { id: String(req.params.id) },
    });

    res.json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

// Create property (admin only)
router.post(
  '/properties',
  protect,
  restrictTo('ADMIN'),
  upload.array('image', 20),
  async (req, res, next) => {
    try {
      const data = propertySchema.parse(req.body);
      const files = req.files as Express.Multer.File[];
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      const property = await prisma.property.create({
        data: {
          ...data,
          contact_info: {
            create: data.contact_info,
          },
          ...(files.length > 0 && {
            images: {
              create: files.map((file) => ({
                url: `${baseUrl}/uploads/properties/${file.filename}`,
              })),
            },
          }),
        },
        include: {
          images: true,
          contact_info: true,
        },
      });

      res.status(201).json({
        status: 'success',
        data: { property },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 
