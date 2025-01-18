import { Router, Response, Request } from 'express';
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
import { USER_ROLES } from '../constants/roles';

const router: Router = Router();

export const propertySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  currency: z.enum(['BGN', 'EUR', 'USD'] as const) satisfies z.ZodType<Currency>,
  area_sqm: z.coerce.number().positive('Area must be positive'),
  land_area_sqm: z.coerce.number().optional(),
  floor: z.coerce.number().optional(),
  total_floors: z.coerce.number().optional(),
  construction_type: z.enum(['BRICK', 'PANEL', 'EPK', 'CONCRETE', 'STEEL', 'WOOD'] as const) satisfies z.ZodType<ConstructionType>,
  furnishing: z.enum(['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED'] as const) satisfies z.ZodType<FurnishingType>,
  location_type: z.enum(['CITY', 'SUBURB', 'VILLAGE', 'SEASIDE', 'MOUNTAIN'] as const) satisfies z.ZodType<LocationType>,
  category: z.enum(['SALE', 'RENT'] as const) satisfies z.ZodType<PropertyCategory>,
  type: z.enum(['APARTMENT', 'HOUSE', 'PLOT', 'COMMERCIAL', 'INDUSTRIAL'] as const) satisfies z.ZodType<PropertyType>,
  featured: z.coerce.boolean().optional(),
  has_regulation: z.coerce.boolean().optional(),
  contact_info: z.object({
    phone: z.string().min(6, 'Phone must be at least 6 characters'),
    email: z.string().email('Invalid email address')
  }),
  region_id: z.coerce.number().optional(),
  neighborhood_id: z.coerce.number().optional()
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
  console.error('Properties route error:', error);

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
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('Prisma error:', {
      code: error.code,
      meta: error.meta,
      message: error.message
    });
    const response: ApiErrorResponse = {
      status: 'error',
      message: 'Database error',
      code: ApiErrorCode.INTERNAL_ERROR
    };
    res.status(500).json(response);
  } else {
    console.error('Unhandled error:', error);
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
router.get('/', async (req: Request, res: Response) => {
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

    console.log('Querying properties with:', {
      where,
      skip,
      take: parseInt(limit),
      include: propertyInclude
    });

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: propertyInclude,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.property.count({ where }),
    ]).catch(error => {
      console.error('Database query error:', error);
      throw error;
    });

    console.log('Found properties:', {
      count: properties.length,
      total
    });

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
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: propertyInclude,
    });

    if (!property) {
      throw new AppError('Property not found', '404');
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
  restrictTo(USER_ROLES.ADMIN),
  upload.array('image', 20),
  async (req, res: Response) => {
    try {
      // Parse fields from multipart/form-data
      const { region_id, neighborhood_id, ...rest } = req.body;
      const parsedBody = {
        ...rest,
        price: req.body.price ? parseInt(req.body.price) : undefined,
        area_sqm: req.body.area_sqm ? parseInt(req.body.area_sqm) : undefined,
        land_area_sqm: req.body.land_area_sqm ? parseInt(req.body.land_area_sqm) : undefined,
        floor: req.body.floor ? parseInt(req.body.floor) : undefined,
        total_floors: req.body.total_floors ? parseInt(req.body.total_floors) : undefined,
        featured: req.body.featured === 'true',
        has_regulation: req.body.has_regulation === 'true',
        region_id: region_id ? parseInt(region_id) : undefined,
        neighborhood_id: neighborhood_id ? parseInt(neighborhood_id) : undefined,
        contact_info: req.body.contact_info ? JSON.parse(req.body.contact_info) : undefined,
        features: req.body.features ? req.body.features.split(',').map(Number) : undefined
      };

      const data = propertySchema.parse(parsedBody);
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
  restrictTo(USER_ROLES.ADMIN),
  upload.array('image', 20),
  async (req, res: Response) => {
    try {
      // Parse fields from multipart/form-data
      const { region_id, neighborhood_id, ...rest } = req.body;
      const parsedBody = {
        ...rest,
        price: req.body.price ? parseInt(req.body.price) : undefined,
        area_sqm: req.body.area_sqm ? parseInt(req.body.area_sqm) : undefined,
        land_area_sqm: req.body.land_area_sqm ? parseInt(req.body.land_area_sqm) : undefined,
        floor: req.body.floor ? parseInt(req.body.floor) : undefined,
        total_floors: req.body.total_floors ? parseInt(req.body.total_floors) : undefined,
        featured: req.body.featured === 'true',
        has_regulation: req.body.has_regulation === 'true',
        contact_info: req.body.contact_info ? JSON.parse(req.body.contact_info) : undefined,
        features: req.body.features ? req.body.features.split(',').map(Number) : undefined
      };

      const validatedData = propertySchema.partial().parse({
        ...parsedBody,
        region_id: region_id ? parseInt(region_id) : undefined,
        neighborhood_id: neighborhood_id ? parseInt(neighborhood_id) : undefined,
      }) as UpdatePropertyInput;

      const files = req.files as Express.Multer.File[];
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // Get the existing property to get the contact info ID
      const existingProperty = await prisma.property.findUnique({
        where: { id: req.params.id },
        include: { contact_info: true },
      });

      if (!existingProperty) {
        throw new AppError('Property not found', '404');
      }

      // Prepare update data without region_id and neighborhood_id
      const { region_id: _rid, neighborhood_id: _nid, ...updateData } = validatedData;

      // Update the property with the correct contact info reference
      const property = await prisma.property.update({
        where: { id: req.params.id },
        data: {
          ...updateData,
          // Handle region relation
          region: validatedData.region_id ? {
            connect: { id: validatedData.region_id }
          } : undefined,
          // Handle neighborhood relation
          neighborhood: validatedData.neighborhood_id ? {
            connect: { id: validatedData.neighborhood_id }
          } : undefined,
          // Handle contact info
          contact_info: validatedData.contact_info ? {
            upsert: {
              create: {
                phone: validatedData.contact_info.phone,
                email: validatedData.contact_info.email,
              },
              update: {
                phone: validatedData.contact_info.phone,
                email: validatedData.contact_info.email,
              },
            },
          } : undefined,
          // Handle images
          ...(files.length > 0 && {
            images: {
              deleteMany: {},
              create: files.map((file) => ({
                url: `${baseUrl}/uploads/properties/${file.filename}`,
              })),
            },
          }),
          // Handle features
          ...(parsedBody.features && {
            features: {
              deleteMany: {},
              create: parsedBody.features.map((featureId: number) => ({
                featureId
              }))
            }
          })
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
router.delete('/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    await prisma.property.delete({
      where: { id: req.params.id },
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

export const propertyRoutes: Router = router; 
