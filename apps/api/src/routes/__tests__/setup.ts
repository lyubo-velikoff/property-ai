// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'file:./test.db';

// Configure test timeouts
jest.setTimeout(30000); 
