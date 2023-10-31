import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Home from '../Central-Components/Home';

// Test 1: Should render the Home component
test('should render Home component', () => {
  render(<Home />);
});
