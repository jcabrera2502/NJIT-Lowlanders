const request = require('supertest');
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();

// Mock OAuth2Client
jest.mock('googleapis');
const mockGenerateAuthUrl = jest.fn();
const mockGetToken = jest.fn();
google.auth.OAuth2 = jest.fn(() => ({
  generateAuthUrl: mockGenerateAuthUrl,
  getToken: mockGetToken,
  setCredentials: jest.fn(),
}));

// Mock axios

// Mock the calendar.events.list method
const mockEventsList = jest.fn();
google.calendar = jest.fn(() => ({
  events: {
    list: mockEventsList,
  },
}));

// Set up CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Set up Express routes ( existing routes)

// Example test

/*
describe('GET /google-proxy', () => {
  it('proxies Google OAuth redirect successfully', async () => {
    // Mock the axios.get method
    axios.get.mockResolvedValue({ data: { message: 'Mocked response' } });

    // Make a request to the route
    const response = await request(app).get('/google-proxy');

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Mocked response' });

   
  });
});
*/

// Example test for the server listening
describe('Server', () => {
  it('should listen on the specified port', (done) => {
    const port = 3001;
    const server = app.listen(port, () => {
      expect(server.address().port).toBe(port);
      server.close(done);
    });
  });
});

describe('Server', () => {
    it('Does not fail on correct port', (done) => {
      const port = 3001;
      const server = app.listen(port, () => {
        expect(server.address().port).toBe(port);
        server.close(done);
      });
    });
  });
  