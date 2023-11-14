global.ResizeObserver = require('resize-observer-polyfill')
// Import the modules you need to mock
jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(),
  };
});

jest.mock('firebase/analytics', () => {
  return {
    getAnalytics: jest.fn(),
  };
});

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(),
  };
});
/*
jest.mock('use-resize-observer', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })),
  }));
  */
  class ResizeObserver {
    observe() {}
    unobserve() {}
  }
import React from 'react';
import Settings from '../components/Central-Components/Settings';
import { render } from '@testing-library/react'; // Make sure to import the render function
import WebIcon from "../../Images/WebIcon.jfif";

test('renders Settings component', () => {
    render(<Settings />);
    // You can add more specific assertions if needed
  });