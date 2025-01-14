import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error';
import { authRoutes } from './routes/auth';
import { propertyRoutes } from './routes/properties';
import contactRoutes from './routes/contact';
import { adminRoutes } from './routes/admin';
import { locationRoutes } from './routes/locations';
import path from 'path';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes);

// Error handling
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 
