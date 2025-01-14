import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../server';
import prisma from '../../lib/prisma';
import jwt from 'jsonwebtoken';

describe('Property Routes', () => {
  let adminToken: string;
  let testPropertyId: string;

  beforeAll(async () => {
    // Create admin user and generate token
    const admin = await prisma.user.create({
      data: {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'ADMIN'
      }
    });
    adminToken = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'test-secret');
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.user.deleteMany({
      where: { email: 'admin@test.com' }
    });
    await prisma.property.deleteMany({
      where: { title: { startsWith: 'Test Property' } }
    });
    await prisma.$disconnect();
  });

  describe('GET /properties', () => {
    it('should return a list of properties', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data.properties)).toBe(true);
    });

    it('should filter properties by price range', async () => {
      const response = await request(app)
        .get('/api/properties?min_price=100000&max_price=500000')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data.properties)).toBe(true);
      response.body.data.properties.forEach((property: any) => {
        expect(property.price).toBeGreaterThanOrEqual(100000);
        expect(property.price).toBeLessThanOrEqual(500000);
      });
    });
  });

  describe('POST /properties', () => {
    it('should create a new property when authenticated as admin', async () => {
      const propertyData = {
        title: 'Test Property',
        description: 'A test property description',
        price: 250000,
        currency: 'EUR',
        area_sqm: 120,
        type: 'HOUSE',
        category: 'SALE'
      };

      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(propertyData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.property).toHaveProperty('id');
      expect(response.body.data.property.title).toBe(propertyData.title);
      testPropertyId = response.body.data.property.id;
    });

    it('should return 401 when not authenticated', async () => {
      const propertyData = {
        title: 'Test Property',
        description: 'A test property description',
        price: 250000,
        currency: 'EUR',
        area_sqm: 120,
        type: 'HOUSE',
        category: 'SALE'
      };

      await request(app)
        .post('/api/properties')
        .send(propertyData)
        .expect(401);
    });
  });
}); 
