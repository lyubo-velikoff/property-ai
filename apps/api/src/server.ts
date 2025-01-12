import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/error.js';
import { authRoutes } from './routes/auth.js';
import { propertyRoutes } from './routes/properties.js';
import contactRoutes from './routes/contact.js';
import { userRoutes } from './routes/users.js';
import adminRoutes from './routes/admin.js';
import logger from './lib/logger.js';

// Load environment variables
config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('Connected to database');

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap(); 
