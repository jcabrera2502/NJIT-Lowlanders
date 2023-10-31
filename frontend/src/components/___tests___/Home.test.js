import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Home from '../Central-Components/Home';

// Mock the Firebase module and FirebaseAuth
//jest.mock('frontend/src/Images/Dhruvy.jfif');
//jest.mock('frontend/mocks/dhruv.png');

// Test 1: Should render the Home component
test('should render Home component', () => {
  render(<Home />);
});
