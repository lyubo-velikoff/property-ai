import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../server';
import prisma from '../../lib/prisma';
import jwt from 'jsonwebtoken';
import { PropertyType, PropertyCategory, Currency, LocationType, type UserRole } from '@avalon/shared-types';

describe('Property Routes', () => {
  let adminToken: string;

  beforeAll(async () => {
    // Create an admin user for testing
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    // Get JWT token for admin
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123',
      });

    console.log('Login response:', response.body);
    adminToken = response.body.data.token;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: {
        email: 'admin@test.com',
      },
    });
  });

  describe('GET /properties', () => {
    it('should return a list of properties', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });

    it('should filter properties by price range', async () => {
      const response = await request(app)
        .get('/api/properties')
        .query({ min_price: '100000', max_price: '500000' })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });
  });

  describe('POST /properties', () => {
    it('should create a new property when authenticated as admin', async () => {
      const propertyData = {
        title: 'Test Property',
        description: 'A test property description',
        price: 200000,
        currency: Currency.USD,
        area_sqm: 120,
        type: PropertyType.APARTMENT,
        category: PropertyCategory.SALE,
        location_type: LocationType.CITY,
        contact_info: {
          phone: '+1234567890',
          email: 'contact@test.com'
        }
      };

      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('title', propertyData.title)
        .field('description', propertyData.description)
        .field('price', propertyData.price.toString())
        .field('currency', propertyData.currency)
        .field('area_sqm', propertyData.area_sqm.toString())
        .field('type', propertyData.type)
        .field('category', propertyData.category)
        .field('location_type', propertyData.location_type)
        .field('contact_info', JSON.stringify(propertyData.contact_info))
        .expect(201);

      console.log('Create property response:', response.body);
      expect(response.body.status).toBe('success');
      expect(response.body.data.property).toBeDefined();
      expect(response.body.data.property.title).toBe(propertyData.title);
    });

    it('should return 401 when not authenticated', async () => {
      const propertyData = {
        title: 'Test Property',
        description: 'A test property description',
        price: 200000,
        currency: Currency.USD,
        area_sqm: 120,
        type: PropertyType.APARTMENT,
        category: PropertyCategory.SALE,
        location_type: LocationType.CITY,
        contact_info: {
          phone: '+1234567890',
          email: 'contact@test.com'
        }
      };

      await request(app)
        .post('/api/properties')
        .field('title', propertyData.title)
        .field('description', propertyData.description)
        .field('price', propertyData.price.toString())
        .field('currency', propertyData.currency)
        .field('area_sqm', propertyData.area_sqm.toString())
        .field('type', propertyData.type)
        .field('category', propertyData.category)
        .field('location_type', propertyData.location_type)
        .field('contact_info', JSON.stringify(propertyData.contact_info))
        .expect(401);
    });
  });
}); 
