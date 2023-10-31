import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AuthDetails from '../Auth-Components/AuthDetails';



// Test 1: Should render the AuthDetails component
test('should render AuthDetails component', () => {
  render(<AuthDetails />);
});
