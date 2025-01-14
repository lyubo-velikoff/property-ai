import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { AppError } from './error';

interface JwtPayload {
  id: string;
}

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
      },
    });

    if (!user) {
      throw new AppError(401, 'The user belonging to this token no longer exists');
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Restrict to certain roles
export const restrictTo = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      throw new AppError(403, 'You do not have permission to perform this action');
    }
    next();
  };
}; 
