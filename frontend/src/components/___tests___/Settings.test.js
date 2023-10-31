import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AuthDetails from '../Auth-Components/AuthDetails';

// Mock the Firebase module and FirebaseAuth
//jest.mock('frontend/src/Images/Dhruvy.jfif');
//jest.mock('frontend/mocks/dhruv.png');

// Test 1: Should render the AuthDetails component
test('should render AuthDetails component', () => {
  render(<AuthDetails />);
});
