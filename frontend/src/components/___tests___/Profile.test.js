import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../Central-Components/Profile';

// Mock the Firebase module and FirebaseAuth
//jest.mock('frontend/src/Images/Dhruvy.jfif');
//jest.mock('frontend/mocks/dhruv.png');

// Test 1: Should render the Home component
test('should render Profile component', () => {
  render(<Profile />);
});
