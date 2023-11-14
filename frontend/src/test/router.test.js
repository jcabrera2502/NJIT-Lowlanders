const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const router = require('../../../backend/api/Logged-In-Email-F2B.js');
jest.mock('mongoose', () => ({
    connection: {
      db: {
        collection: jest.fn(() => ({
          findOne: jest.fn(),
          insertOne: jest.fn(),
          updateOne: jest.fn(),
        })),
      },
    },
  }));const app = express();
app.use(express.json());
app.use('/', router);

beforeAll(async () => {
  // Connect to the test database or perform other setup tasks
  await mongoose.connect('your-test-database-uri', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Disconnect from the test database or perform cleanup tasks
  await mongoose.disconnect();
});

describe('GET /api/email', () => {
  test('should respond with user information', async () => {
    const response = await request(app).get('/api/email').query({ email: 'test@example.com' });
    expect(response.status).toBe(200);
    // Add more assertions based on your expected response
  });
});

describe('POST /api/new', () => {
  test('should insert new user data', async () => {
    const response = await request(app).post('/api/new').send({ email: 'newuser@example.com' });
    expect(response.status).toBe(200);
    // Add more assertions based on your expected response
  });
});

describe('PUT /api/updateProfile', () => {
  test('should update user profile', async () => {
    const response = await request(app).put('/api/updateProfile').send({
      params: {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15,
      },
    });
    expect(response.status).toBe(200);
    // Add more assertions based on your expected response
  });
});
