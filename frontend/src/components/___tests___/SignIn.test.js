import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../Auth-Components/SignIn';

// Mock the Firebase module and FirebaseAuth
import { auth } from '../../firebase'; // Mock the 'auth' module from Firebase
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // Mock the 'signInWithEmailAndPassword' and 'sendPasswordResetEmail' functions

// Mock Firebase and FirebaseAuth
jest.mock('../../firebase'); // Mock the entire Firebase module
jest.mock('firebase/auth'); // Mock the 'firebase/auth' module

// Test 1: Should render the SignIn component
test('should render SignIn component', () => {
  render(<SignIn />);
});

// Test 2: Should update email and password input values
test('should update email and password input values', () => {
  const { getByPlaceholderText } = render(<SignIn />);
  const emailInput = getByPlaceholderText('Enter your email');
  const passwordInput = getByPlaceholderText('Enter your password');

  // Simulate user input by changing the input field values
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

  // Assert that the input values have been updated correctly
  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('testPassword');
});

// Test 3: Should trigger sign-in when the form is submitted
test('should trigger sign-in when the form is submitted', async () => {
  const { getByPlaceholderText, getByText } = render(<SignIn />);
  const emailInput = getByPlaceholderText('Enter your email');
  const passwordInput = getByPlaceholderText('Enter your password');
  const loginButton = getByText('Log In');

  // Mock the sign-in function from Firebase
  const mockSignInWithEmailAndPassword = jest.fn(() => {
    return Promise.resolve({ user: { emailVerified: true } }); // Resolve with a user credential
  });
  signInWithEmailAndPassword.mockImplementation(mockSignInWithEmailAndPassword);

  // Simulate user input by changing the input field values
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

  // Simulate a form submission by clicking the login button
  fireEvent.click(loginButton);


  // Use waitFor to wait for asynchronous actions to complete
  await waitFor(() => {
    // Add assertions here for the expected behavior after sign-in
  });

  // Assert that the sign-in function was called with the correct arguments
  expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'testPassword');
});

test('should redirect when email is verified', async () => {
    // Mock the Firebase signInWithEmailAndPassword function to simulate email verification
    const mockSignInWithEmailAndPassword = jest.fn(() => {
      //this simulates the field that shows the email is verified in firebase
      return Promise.resolve({ user: { emailVerified: true } });
    });
  
    signInWithEmailAndPassword.mockImplementation(mockSignInWithEmailAndPassword);
  
    // Spy on window.location.href to track URL changes
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      ...originalLocation,
      href: '',
    };
  
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Log In');
  
    // Simulate user input by changing the input field values
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword1' } });
  
    // Simulate a form submission by clicking the Log In button
    fireEvent.click(signInButton);
  
    // Wait for the asynchronous actions to complete
    await waitFor(() => {
      // Assert that the user is redirected to the expected URL
      expect(window.location.href).toBe('http://localhost:3000/');
    });
  
    // Clean up the spy on window.location
    window.location = originalLocation;
  });