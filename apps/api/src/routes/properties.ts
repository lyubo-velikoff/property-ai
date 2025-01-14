import express from 'express';
import { z } from 'zod';
import { PrismaClient, Prisma } from '@prisma/client';
import multer from 'multer';
import { protect, restrictTo } from '../middleware/auth';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/error';
import { upload } from '../config/multer';

const router = express.Router();

// Middleware to restrict access to admin users
const adminOnly = [protect, restrictTo('ADMIN')];

export const propertySchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  currency: z.enum(['BGN', 'EUR']),
  area_sqm: z.coerce.number(),
  floor: z.coerce.number().optional(),
  construction_type: z.enum(['BRICK', 'EPK', 'PK', 'PANEL', 'WOOD_FLOOR']).optional(),
  furnishing: z.enum(['FURNISHED', 'PARTIALLY_FURNISHED', 'UNFURNISHED']).optional(),
  location_type: z.enum(['CITY', 'REGION']).default('CITY'),
  category: z.enum(['SALE', 'RENT']).default('SALE'),
  type: z.enum(['APARTMENT', 'HOUSE', 'PLOT', 'COMMERCIAL', 'INDUSTRIAL']).default('APARTMENT'),
  featured: z.coerce.boolean().optional(),
  contact_info: z.object({
    phone: z.string(),
    email: z.string().email()
  }).optional()
});

const propertyInclude = {
  region: true,
  neighborhood: true,
  features: {
    include: {
      feature: true
    }
  },
  images: true,
  contact_info: true,
} as const;

const handleError = (error: unknown, res: express.Response) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ 
      status: 'error',
      message: 'Invalid input data',
      errors: error.errors 
    });
  } else {
    console.error(error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
};

// Get all properties with filtering
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const { 
      type, 
      category, 
      regionId, 
      neighborhoodId, 
      location_type,
      features,
      min_price,
      max_price,
      min_area,
      max_area,
      search,
      page = '1', 
      limit = '10' 
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: Prisma.PropertyWhereInput = {
      ...(type && { type: type as string }),
      ...(category && { category: category as string }),
      ...(regionId && { regionId: parseInt(regionId as string) }),
      ...(neighborhoodId && { neighborhoodId: parseInt(neighborhoodId as string) }),
      ...(location_type && { location_type: location_type as string }),
      ...(search && {
        OR: [
          { title: { contains: search as string } },
          { description: { contains: search as string } }
        ]
      }),
      ...(features && {
        features: {
          some: {
            featureId: {
              in: (features as string).split(',').map(Number)
            }
          }
        }
      }),
    };

    // Handle price range when both min and max are provided
    if (min_price && max_price) {
      where.price = {
        gte: parseInt(min_price as string),
        lte: parseInt(max_price as string)
      };
    } else {
      if (min_price) where.price = { gte: parseInt(min_price as string) };
      if (max_price) where.price = { lte: parseInt(max_price as string) };
    }

    // Handle area range when both min and max are provided
    if (min_area && max_area) {
      where.area_sqm = {
        gte: parseInt(min_area as string),
        lte: parseInt(max_area as string)
      };
    } else {
      if (min_area) where.area_sqm = { gte: parseInt(min_area as string) };
      if (max_area) where.area_sqm = { lte: parseInt(max_area as string) };
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: propertyInclude,
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
    handleError(error, res);
  }
});

// Get featured properties
router.get('/featured', async (req, res, next) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        featured: true,
      },
      include: propertyInclude,
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
      include: propertyInclude,
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

// Create property
router.post('/', adminOnly, upload.array('images'), async (req: express.Request, res: express.Response) => {
  try {
    const data = propertySchema.parse(req.body);
    const files = (req.files || []) as Express.Multer.File[];

    const property = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        area_sqm: data.area_sqm,
        floor: data.floor,
        construction_type: data.construction_type,
        furnishing: data.furnishing,
        location_type: data.location_type,
        category: data.category,
        type: data.type,
        featured: data.featured,
        contact_info: data.contact_info ? {
          create: {
            phone: data.contact_info.phone,
            email: data.contact_info.email
          }
        } : undefined,
        images: files.length > 0 ? {
          create: files.map(file => ({
            url: file.filename
          }))
        } : undefined
      },
      include: propertyInclude
    });

    res.status(201).json({
      status: 'success',
      data: { property }
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Update property
router.patch('/:id', adminOnly, upload.array('images'), async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const data = propertySchema.parse(req.body);
    const files = (req.files || []) as Express.Multer.File[];

    const property = await prisma.property.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        area_sqm: data.area_sqm,
        floor: data.floor,
        construction_type: data.construction_type,
        furnishing: data.furnishing,
        location_type: data.location_type,
        category: data.category,
        type: data.type,
        featured: data.featured,
        contact_info: data.contact_info ? {
          upsert: {
            create: {
              phone: data.contact_info.phone,
              email: data.contact_info.email
            },
            update: {
              phone: data.contact_info.phone,
              email: data.contact_info.email
            }
          }
        } : undefined,
        images: files.length > 0 ? {
          create: files.map(file => ({
            url: file.filename
          }))
        } : undefined
      },
      include: propertyInclude
    });

    res.json({
      status: 'success',
      data: { property }
    });
  } catch (error) {
    handleError(error, res);
  }
});

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
