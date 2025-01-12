import { Request } from 'express';
import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
      };
      files?: Express.Multer.File[];
    }
  }
}

export {}; 
