import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../Central-Components/Profile';


// Test 1: Should render the Profile component
test('should render Profile component', () => {
  render(<Profile />);
});
