import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from '../components/Central-Components/Profile';

describe('Profile Component', () => {
  test('handles password update with unmatched passwords', async () => {
    render(<Profile />);

    // Simulate user entering passwords
    userEvent.type(screen.getByPlaceholderText(/current password/i), 'currentPassword123');
    userEvent.type(screen.getByPlaceholderText(/new password/i), 'newPassword123');
    userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'unmatchedPassword123');

    // Trigger the save button click
    fireEvent.click(screen.getByText(/save/i));

    // Wait for asynchronous operations to complete
    await waitFor(() => {});

    // Assert that the error message is displayed
    expect(screen.getByText(/new passwords do not match/i)).toBeInTheDocument();
  });
});
