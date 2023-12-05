import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import routes from '../../../backend/api/Logged-In-Email-F2B.js';
const app = express();
app.use(express.json());
app.use('/', routes);

// Add a mock for mongoose's connection to avoid connecting to the actual database
jest.mock('mongoose');
mongoose.connection = {
  db: {
    collection: jest.fn(() => ({ findOne: jest.fn(), insertOne: jest.fn(), updateOne: jest.fn(), find: jest.fn() })),
  },
};
jest.mock('mongoose');
const mockUpdateOne = jest.fn();
mongoose.connection.db.collection.mockImplementation(() => ({
  updateOne: mockUpdateOne,
}));

jest.mock('mongoose');
const mockInsertOne = jest.fn();
mongoose.connection.db.collection.mockImplementation(() => ({
  insertOne: mockInsertOne,
}));

jest.mock('mongoose');
const mockFind = jest.fn();
mongoose.connection.db.collection.mockImplementation(() => ({
  find: mockFind,
  toArray: jest.fn(), // Mocking toArray separately
}));
describe('Your Routes', () => {
 /* test('GET /api/email', async () => {
    const response = await request(app).get('/api/email').query({ email: 'example@example.com' });
    expect(response.statusCode).toBe(500);
  });
*/
  test('POST /api/new', async () => {
    const response = await request(app).post('/api/new').send({ email: 'example' });
    expect(response.statusCode).toBe(500);
  });

 test('POST Inval', async () => {
    const response = await request(app).post('/api/new').send({ email: 'example2.com' });
    expect(response.statusCode).toBe(500);
  });

  test('Invalid Email', async () => {
    const response = await request(app).post('/api/new').send({ email: 'example4@.com' });
    expect(response.statusCode).toBe(500);
    // Add more assertions as needed
  });
  test('GET /api/new', async () => {
    const response = await request(app)
      .post('/api/new')  // Use post instead of get
      .send({ email: 'example4@.com' });
  
    expect(response.statusCode).toBe(500);
    // Add more assertions as needed
  });

});


