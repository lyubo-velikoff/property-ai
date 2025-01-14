import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { AppError } from './error';
import { User, UserRole } from '@avalon/shared-types';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

interface JwtPayload {
  id: string;
}

const mapUserToResponse = (user: { 
  id: string; 
  name: string; 
  email: string; 
  role: string;
  createdAt: Date;
}): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role as UserRole,
  createdAt: user.createdAt.toISOString()
});

// Protect routes
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError(401, 'Please log in to access this resource');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Get user from token
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
    });

    if (!user) {
      throw new AppError(401, 'The user belonging to this token no longer exists');
    }

    // Add user to request
    req.user = mapUserToResponse(user);
    next();
  } catch (error) {
    next(error);
  }
};

// Restrict to certain roles
export const restrictTo = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      throw new AppError(403, 'You do not have permission to perform this action');
    }
    next();
  };
}; 
