import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { protect, restrictTo } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { upload } from '../config/multer';
import { propertySchema } from './properties';
import { USER_ROLES } from '../constants/roles';
import { 
  ApiSuccessResponse, 
  ApiErrorResponse,
  ApiErrorCode,
  UserRole,
  User,
  Property,
  AdminStatsResponse,
  PropertiesResponse,
  PropertyResponse,
  CreateUserInput,
  UpdateUserInput,
  UsersResponse,
  UserResponse
} from '@avalon/shared-types';

const router = Router();

// User schema for validation
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'ADMIN'] as const).default('USER'),
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

// Get admin dashboard stats
router.get('/stats', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const [properties, messages, users] = await Promise.all([
      prisma.property.count(),
      prisma.contactMessage.count(),
      prisma.user.count(),
    ]);

    const response: ApiSuccessResponse<AdminStatsResponse> = {
      status: 'success',
      data: {
        properties,
        messages,
        users,
      },
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Get all properties (admin)
router.get('/properties', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images: true,
          contact_info: true,
        },
      }),
      prisma.property.count(),
    ]);

    const response: ApiSuccessResponse<PropertiesResponse> = {
      status: 'success',
      data: {
        data: properties.map(mapProperty),
        meta: {
          total,
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: skip + limit < total,
          hasPreviousPage: page > 1
        }
      }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Get single property (admin)
router.get('/properties/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        images: true,
        contact_info: true,
      },
    });

    if (!property) {
      throw new AppError('404', 'Property not found');
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

// Update property (admin only)
router.patch(
  '/properties/:id',
  protect,
  restrictTo(USER_ROLES.ADMIN),
  upload.array('image', 20),
  async (req, res: Response) => {
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
        throw new AppError('404', 'Property not found');
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
        include: {
          images: true,
          contact_info: true,
        },
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

// Get all users (admin)
router.get('/users', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
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

    const response: ApiSuccessResponse<UsersResponse> = {
      status: 'success',
      data: {
        users: users.map(mapUser),
        meta: {
          total,
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: skip + limit < total,
          hasPreviousPage: page > 1
        }
      }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Get single user (admin)
router.get('/users/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
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
      throw new AppError('404', 'User not found');
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

// Create user (admin)
router.post('/users', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const data = userSchema.parse(req.body);

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('400', 'User with this email already exists');
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

// Update user (admin)
router.patch('/users/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    const data = userSchema.partial().parse(req.body) as UpdateUserInput;

    // If email is being updated, check if it's already taken
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id: String(req.params.id) },
        },
      });

      if (existingUser) {
        throw new AppError('400', 'User with this email already exists');
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

    const response: ApiSuccessResponse<UserResponse> = {
      status: 'success',
      data: { user: mapUser(user) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Delete user (admin)
router.delete('/users/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: String(req.params.id) },
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

// Create property (admin only)
router.post(
  '/properties',
  protect,
  restrictTo(USER_ROLES.ADMIN),
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
        include: {
          images: true,
          contact_info: true,
        },
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

export const adminRoutes: Router = router; 
