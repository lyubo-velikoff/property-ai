import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';
import { upload } from '../config/multer.js';
import { propertySchema } from './properties.js';

const router = Router();

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
  upload.array('images', 10),
  async (req, res, next) => {
    try {
      const data = propertySchema.parse(req.body);
      const files = req.files as Express.Multer.File[];

      const property = await prisma.property.update({
        where: { id: req.params.id },
        data: {
          ...data,
          contact_info: {
            update: data.contact_info,
          },
          ...(files.length > 0 && {
            images: {
              deleteMany: {},
              create: files.map((file) => ({
                url: `/uploads/${file.filename}`,
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

export default router; 
