import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';
import { upload } from '../config/multer.js';

const router = Router();

export const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().transform((val) => Number(val)),
  currency: z.enum(['BGN', 'EUR', 'USD']).default('EUR'),
  area_sqm: z.string().transform((val) => Number(val)),
  floor: z.string().transform((val) => val ? Number(val) : undefined).optional(),
  construction_type: z.string().optional(),
  furnishing: z.string().optional(),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  category: z.string().transform((val) => val.toUpperCase()).pipe(z.enum(['SALE', 'RENT'])),
  type: z.string().transform((val) => val.toUpperCase()).pipe(z.enum(['APARTMENT', 'HOUSE', 'OFFICE', 'STORE', 'LAND'])),
  contact_info: z.string().transform((val) => JSON.parse(val)),
});

// Get all properties with filtering
router.get('/', async (req, res, next) => {
  try {
    const { type, category, location, page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      ...(type && { type: type as string }),
      ...(category && { category: category as string }),
      ...(location && { location: { contains: location as string } }),
    };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: true,
          contact_info: true,
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.property.count({ where }),
    ]);

    res.json({
      status: 'success',
      data: {
        properties,
        total,
        page: parseInt(page as string),
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get featured properties
router.get('/featured', async (req, res, next) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        featured: true,
      },
      include: {
        images: true,
        contact_info: true,
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      status: 'success',
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
});

// Get single property
router.get('/:id', async (req, res, next) => {
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

// Create property (admin only)
router.post(
  '/',
  protect,
  restrictTo('ADMIN'),
  upload.array('images', 10),
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
          images: {
            create: files.map((file) => ({
              url: `${baseUrl}/uploads/properties/${file.filename}`,
            })),
          },
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

// Update property (admin only)
router.patch(
  '/:id',
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

// Delete property (admin only)
router.delete('/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    await prisma.property.delete({
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

export const propertyRoutes = router; 
