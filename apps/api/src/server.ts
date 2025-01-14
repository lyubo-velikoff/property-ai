import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import prisma from './lib/prisma.js';
import { authRoutes } from './routes/auth.js';
import { propertyRoutes } from './routes/properties.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';
import { locationRoutes } from './routes/locations.js';

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
app.use('/api', locationRoutes);

export default app; 
