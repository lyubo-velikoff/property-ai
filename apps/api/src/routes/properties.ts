import express, { Response } from 'express';
import { z } from 'zod';
import { PrismaClient, Prisma } from '@prisma/client';
import multer from 'multer';
import { protect, restrictTo } from '../middleware/auth';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/error';
import { upload } from '../config/multer';
import { 
  PropertyType, 
  PropertyCategory, 
  LocationType, 
  Currency, 
  ConstructionType, 
  FurnishingType,
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiErrorCode,
  PropertyResponse,
  PropertiesResponse,
  GetPropertiesParams,
  CreatePropertyInput,
  UpdatePropertyInput,
  Property,
  UserRole
} from '@avalon/shared-types';

const router = express.Router();

export const propertySchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  currency: z.nativeEnum(Currency),
  area_sqm: z.coerce.number(),
  floor: z.coerce.number().optional(),
  construction_type: z.nativeEnum(ConstructionType).optional(),
  furnishing: z.nativeEnum(FurnishingType).optional(),
  location_type: z.nativeEnum(LocationType).optional().default(LocationType.CITY),
  category: z.nativeEnum(PropertyCategory).optional().default(PropertyCategory.SALE),
  type: z.nativeEnum(PropertyType).optional().default(PropertyType.APARTMENT),
  featured: z.coerce.boolean().optional(),
  contact_info: z.object({
    phone: z.string(),
    email: z.string().email()
  }).optional()
}) satisfies z.ZodType<CreatePropertyInput>;

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

const mapProperty = (property: any): Property => ({
  ...property,
  createdAt: property.createdAt.toISOString(),
  updatedAt: property.updatedAt.toISOString(),
  images: property.images?.map((image: any) => ({
    ...image,
    createdAt: image.createdAt.toISOString(),
    updatedAt: image.updatedAt.toISOString()
  })),
  contact_info: property.contact_info ? {
    ...property.contact_info,
    createdAt: property.contact_info.createdAt.toISOString(),
    updatedAt: property.contact_info.updatedAt.toISOString()
  } : undefined
});

// Get all properties with filtering
router.get('/', async (req, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      min_price,
      max_price,
      min_area,
      max_area,
      type,
      category,
      location_type,
      construction_type,
      furnishing,
      featured,
    } = req.query as GetPropertiesParams;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: Prisma.PropertyWhereInput = {};

    // Apply filters
    if (type) where.type = type;
    if (category) where.category = category;
    if (location_type) where.location_type = location_type;
    if (construction_type) where.construction_type = construction_type;
    if (furnishing) where.furnishing = furnishing;
    if (featured) where.featured = featured === 'true';

    // Handle price range when both min and max are provided
    if (min_price && max_price) {
      where.price = {
        gte: parseInt(min_price),
        lte: parseInt(max_price)
      };
    } else {
      if (min_price) where.price = { gte: parseInt(min_price) };
      if (max_price) where.price = { lte: parseInt(max_price) };
    }

    // Handle area range when both min and max are provided
    if (min_area && max_area) {
      where.area_sqm = {
        gte: parseInt(min_area),
        lte: parseInt(max_area)
      };
    } else {
      if (min_area) where.area_sqm = { gte: parseInt(min_area) };
      if (max_area) where.area_sqm = { lte: parseInt(max_area) };
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: propertyInclude,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.property.count({ where }),
    ]);

    const response: ApiSuccessResponse<PropertiesResponse> = {
      status: 'success',
      data: {
        data: properties.map(mapProperty),
        meta: {
          total,
          page: parseInt(page),
          pageSize: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
          hasNextPage: skip + parseInt(limit) < total,
          hasPreviousPage: parseInt(page) > 1
        }
      }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Get featured properties
router.get('/featured', async (req, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        featured: true,
      },
      include: propertyInclude,
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    const response: ApiSuccessResponse<PropertiesResponse> = {
      status: 'success',
      data: {
        data: properties.map(mapProperty),
        meta: {
          total: properties.length,
          page: 1,
          pageSize: 6,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        }
      }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Get single property
router.get('/:id', async (req, res: Response) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: propertyInclude,
    });

    if (!property) {
      throw new AppError(404, 'Property not found');
    }

    const response: ApiSuccessResponse<PropertyResponse> = {
      status: 'success',
      data: { property: mapProperty(property) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Create property (admin only)
router.post(
  '/',
  protect,
  restrictTo(UserRole.ADMIN),
  upload.array('image', 20),
  async (req, res: Response) => {
    try {
      const data = propertySchema.parse(req.body);
      const files = req.files as Express.Multer.File[];
      const baseUrl = `${req.protocol}://${req.get('host')}`;

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
              email: data.contact_info.email,
            },
          } : undefined,
          ...(files.length > 0 && {
            images: {
              create: files.map((file) => ({
                url: `${baseUrl}/uploads/properties/${file.filename}`,
              })),
            },
          }),
        },
        include: propertyInclude,
      });

      const response: ApiSuccessResponse<PropertyResponse> = {
        status: 'success',
        data: { property: mapProperty(property) }
      };

      res.status(201).json(response);
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Update property (admin only)
router.patch(
  '/:id',
  protect,
  restrictTo(UserRole.ADMIN),
  upload.array('image', 20),
  async (req, res: Response) => {
    try {
      const data = propertySchema.partial().parse(req.body) as UpdatePropertyInput;
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
            update: {
              phone: data.contact_info.phone,
              email: data.contact_info.email,
            },
          } : undefined,
          ...(files.length > 0 && {
            images: {
              deleteMany: {},
              create: files.map((file) => ({
                url: `${baseUrl}/uploads/properties/${file.filename}`,
              })),
            },
          }),
        },
        include: propertyInclude,
      });

      const response: ApiSuccessResponse<PropertyResponse> = {
        status: 'success',
        data: { property: mapProperty(property) }
      };

      res.json(response);
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Delete property (admin only)
router.delete('/:id', protect, restrictTo(UserRole.ADMIN), async (req, res: Response) => {
  try {
    await prisma.property.delete({
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

export const propertyRoutes = router; 
