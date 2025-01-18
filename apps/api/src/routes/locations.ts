import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { protect, restrictTo } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { USER_ROLES } from '../constants/roles';
import { 
  ApiSuccessResponse, 
  ApiErrorResponse,
  ApiErrorCode,
  CreateLocationInput,
  CreateFeatureInput,
  RegionResponse,
  RegionsResponse,
  NeighborhoodResponse,
  NeighborhoodsResponse,
  FeatureResponse,
  FeaturesResponse,
  FeatureType,
  UserRole,
  Feature,
  Region,
  Neighborhood
} from '@avalon/shared-types';

const router = Router();

const locationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
}) satisfies z.ZodType<CreateLocationInput>;

const featureSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['INFRASTRUCTURE', 'BUILDING'] as const),
}) satisfies z.ZodType<CreateFeatureInput>;

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

const mapDatesToISOString = <T extends { createdAt: Date; updatedAt: Date }>(
  item: T
): Omit<T, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string } => ({
  ...item,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString()
});

const mapRegion = (region: { id: number; name: string; createdAt: Date; updatedAt: Date }): Region => ({
  ...mapDatesToISOString(region)
});

const mapNeighborhood = (neighborhood: { id: number; name: string; createdAt: Date; updatedAt: Date }): Neighborhood => ({
  ...mapDatesToISOString(neighborhood)
});

const mapFeature = (feature: { id: number; name: string; type: string; createdAt: Date; updatedAt: Date }): Feature => ({
  ...mapDatesToISOString(feature),
  type: feature.type as FeatureType
});

// Get all regions
router.get('/regions', protect, async (req, res: Response, next) => {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { name: 'asc' },
    });

    const response: ApiSuccessResponse<RegionsResponse> = {
      status: 'success',
      data: { regions: regions.map(mapRegion) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Get all neighborhoods
router.get('/neighborhoods', protect, async (req, res: Response, next) => {
  try {
    const neighborhoods = await prisma.neighborhood.findMany({
      orderBy: { name: 'asc' },
    });

    const response: ApiSuccessResponse<NeighborhoodsResponse> = {
      status: 'success',
      data: { neighborhoods: neighborhoods.map(mapNeighborhood) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Get all features
router.get('/features', protect, async (req, res: Response, next) => {
  try {
    const features = await prisma.feature.findMany({
      orderBy: [
        { type: 'asc' },
        { name: 'asc' }
      ],
    });

    const response: ApiSuccessResponse<FeaturesResponse> = {
      status: 'success',
      data: { features: features.map(mapFeature) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Create region (admin only)
router.post('/regions', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response, next) => {
  try {
    const { name } = locationSchema.parse(req.body);

    const region = await prisma.region.create({
      data: { name },
    });

    const response: ApiSuccessResponse<RegionResponse> = {
      status: 'success',
      data: { region: mapRegion(region) }
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Create neighborhood (admin only)
router.post('/neighborhoods', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response, next) => {
  try {
    const { name } = locationSchema.parse(req.body);

    const neighborhood = await prisma.neighborhood.create({
      data: { name },
    });

    const response: ApiSuccessResponse<NeighborhoodResponse> = {
      status: 'success',
      data: { neighborhood: mapNeighborhood(neighborhood) }
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Create feature (admin only)
router.post('/features', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response, next) => {
  try {
    const { name, type } = featureSchema.parse(req.body);

    const feature = await prisma.feature.create({
      data: { 
        name,
        type: type as string // Cast to string for Prisma
      },
    });

    const response: ApiSuccessResponse<FeatureResponse> = {
      status: 'success',
      data: { feature: mapFeature(feature) }
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Update region (admin only)
router.patch('/regions/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response, next) => {
  try {
    const data = locationSchema.partial().parse(req.body);

    const region = await prisma.region.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    const response: ApiSuccessResponse<RegionResponse> = {
      status: 'success',
      data: { region: mapRegion(region) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Update neighborhood (admin only)
router.patch('/neighborhoods/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response, next) => {
  try {
    const data = locationSchema.partial().parse(req.body);

    const neighborhood = await prisma.neighborhood.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    const response: ApiSuccessResponse<NeighborhoodResponse> = {
      status: 'success',
      data: { neighborhood: mapNeighborhood(neighborhood) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Update feature (admin only)
router.patch('/features/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response, next) => {
  try {
    const data = featureSchema.partial().parse(req.body);

    const feature = await prisma.feature.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: data.name,
        type: data.type as string | undefined
      },
    });

    const response: ApiSuccessResponse<FeatureResponse> = {
      status: 'success',
      data: { feature: mapFeature(feature) }
    };

    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// Delete region (admin only)
router.delete('/regions/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response, next) => {
  try {
    await prisma.region.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Delete neighborhood (admin only)
router.delete('/neighborhoods/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response, next) => {
  try {
    await prisma.neighborhood.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Delete feature (admin only)
router.delete('/features/:id', protect, restrictTo(USER_ROLES.ADMIN), async (req, res: Response, next) => {
  try {
    await prisma.feature.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    handleError(error, res);
  }
});

export const locationRoutes: Router = router; 
