import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import prisma from './lib/prisma';
import { authRoutes } from './routes/auth';
import { propertyRoutes } from './routes/properties';
import contactRoutes from './routes/contact';
import adminRoutes from './routes/admin';
import { locationRoutes } from './routes/locations';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes);

export default app; 
