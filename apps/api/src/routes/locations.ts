import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';

const router = Router();

// Get all regions
router.get('/regions', async (req, res, next) => {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({
      status: 'success',
      data: { regions },
    });
  } catch (error) {
    next(error);
  }
});

// Get all neighborhoods
router.get('/neighborhoods', async (req, res, next) => {
  try {
    const neighborhoods = await prisma.neighborhood.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({
      status: 'success',
      data: { neighborhoods },
    });
  } catch (error) {
    next(error);
  }
});

// Get all features
router.get('/features', async (req, res, next) => {
  try {
    const features = await prisma.feature.findMany({
      orderBy: [
        { type: 'asc' },
        { name: 'asc' }
      ],
    });

    res.json({
      status: 'success',
      data: { features },
    });
  } catch (error) {
    next(error);
  }
});

// Create region (admin only)
router.post('/regions', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const schema = z.object({
      id: z.number(),
      name: z.string().min(2, 'Name must be at least 2 characters'),
    });

    const data = schema.parse(req.body);

    const region = await prisma.region.create({
      data,
    });

    res.status(201).json({
      status: 'success',
      data: { region },
    });
  } catch (error) {
    next(error);
  }
});

// Create neighborhood (admin only)
router.post('/neighborhoods', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const schema = z.object({
      id: z.number(),
      name: z.string().min(2, 'Name must be at least 2 characters'),
    });

    const data = schema.parse(req.body);

    const neighborhood = await prisma.neighborhood.create({
      data,
    });

    res.status(201).json({
      status: 'success',
      data: { neighborhood },
    });
  } catch (error) {
    next(error);
  }
});

// Create feature (admin only)
router.post('/features', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      type: z.enum(['INFRASTRUCTURE', 'BUILDING']),
    });

    const data = schema.parse(req.body);

    const feature = await prisma.feature.create({
      data,
    });

    res.status(201).json({
      status: 'success',
      data: { feature },
    });
  } catch (error) {
    next(error);
  }
});

// Update region (admin only)
router.patch('/regions/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
    });

    const data = schema.parse(req.body);

    const region = await prisma.region.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    res.json({
      status: 'success',
      data: { region },
    });
  } catch (error) {
    next(error);
  }
});

// Update neighborhood (admin only)
router.patch('/neighborhoods/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
    });

    const data = schema.parse(req.body);

    const neighborhood = await prisma.neighborhood.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    res.json({
      status: 'success',
      data: { neighborhood },
    });
  } catch (error) {
    next(error);
  }
});

// Update feature (admin only)
router.patch('/features/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      type: z.enum(['INFRASTRUCTURE', 'BUILDING']),
    });

    const data = schema.parse(req.body);

    const feature = await prisma.feature.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    res.json({
      status: 'success',
      data: { feature },
    });
  } catch (error) {
    next(error);
  }
});

// Delete region (admin only)
router.delete('/regions/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    await prisma.region.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

// Delete neighborhood (admin only)
router.delete('/neighborhoods/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    await prisma.neighborhood.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

// Delete feature (admin only)
router.delete('/features/:id', protect, restrictTo('ADMIN'), async (req, res, next) => {
  try {
    await prisma.feature.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

export const locationRoutes = router; 
