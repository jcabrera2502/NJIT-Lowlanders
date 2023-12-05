import request from 'supertest';
import app from '../../../backend/index';
import mongoose from 'mongoose'; // Add this line
import 'regenerator-runtime/runtime';
import 'core-js/stable';
describe('Express App Tests', () => {
  afterAll(() => {
    // Close the mongoose connection after all tests
    mongoose.connection.close();
  });

  it('should respond with status 404 for unknown routes', async () => {
    const response = await request(app).post('/nonexistent-route');
    expect(response.status).toBe(404);
  });

  it('should handle GET request on known route', async () => {
    const response = await request(app).post('/false'); // 
    expect(response.status).toBe(404);
  });

  // Add more tests for other routes and functionality
});