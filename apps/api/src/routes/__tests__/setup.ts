import { describe, it, expect } from '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '30d';
process.env.DATABASE_URL = 'file:./test.db';

// Configure test timeouts
jest.setTimeout(30000);

describe('Test Environment Setup', () => {
  it('should have correct environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBe('test-secret-key');
    expect(process.env.JWT_EXPIRES_IN).toBe('30d');
    expect(process.env.DATABASE_URL).toBe('file:./test.db');
  });
});

describe('Setup', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
}); 
