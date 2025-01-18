import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { type User, type UserRole } from '@avalon/shared-types';
import { AppError } from './error';
import { USER_ROLES } from '../constants/roles';

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
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError(401, 'Not authorized to access this route');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new AppError(401, 'Not authorized to access this route');
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      createdAt: user.createdAt.toISOString()
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Restrict to certain roles
export const restrictTo = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      throw new AppError(403, 'Not authorized to access this route');
    }
    next();
  };
}; 
