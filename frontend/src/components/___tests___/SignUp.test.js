import '@testing-library/jest-dom/extend-expect'; // Import this at the beginning of your test file

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'; // Ensure you've imported "screen"
import SignUp from '../Auth-Components/SignUp'; // Adjust the import path as needed

// Mock the Firebase module and FirebaseAuth
import { auth } from '../../firebase'; // Mock the 'auth' module from Firebase
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'; // Mock the 'createUserWithEmailAndPassword' and 'sendEmailVerification' functions

// Mock Firebase and FirebaseAuth
jest.mock('../../firebase'); // Mock the entire Firebase module
jest.mock('firebase/auth'); // Mock the 'firebase/auth' module

// Test: Should display an error message when password does not meet complexity requirements
test('should display error message when password is too simple', () => {
  const { getByPlaceholderText, getByText } = render(<SignUp />);
  const passwordInput = getByPlaceholderText('Enter your password');
  const confirmPasswordInput = getByPlaceholderText('Confirm your password');
  const signUpButton = getByText('Sign Up');

  // Simulate user input by changing the input field values
  fireEvent.change(passwordInput, { target: { value: 'simple' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'simple' } });

  // Simulate a form submission by clicking the sign-up button
  fireEvent.click(signUpButton);

  // Use `waitFor` to wait for the error message to be displayed
  waitFor(() => {
    // Assert that the error message is displayed
    const errorMessage = getByText(/Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number./i);
    expect(errorMessage).toBeInTheDocument();
  });
});

// Test: Should display an error message when password does not meet complexity requirements
test('should display error message when password does not have uppercase', () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const passwordInput = getByPlaceholderText('Enter your password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    const signUpButton = getByText('Sign Up');
  
    // Simulate user input by changing the input field values
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password1' } });
  
    // Simulate a form submission by clicking the sign-up button
    fireEvent.click(signUpButton);
  
    // Use `waitFor` to wait for the error message to be displayed
    waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = getByText(/Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number./i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
  
// Test: Should display an error message when password does not meet complexity requirements
test('should display error message when password does not have a lowercase letter', () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const passwordInput = getByPlaceholderText('Enter your password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    const signUpButton = getByText('Sign Up');
  
    // Simulate user input by changing the input field values
    fireEvent.change(passwordInput, { target: { value: 'PASSWORD' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'PASSWORD' } });
  
    // Simulate a form submission by clicking the sign-up button
    fireEvent.click(signUpButton);
  
    // Use `waitFor` to wait for the error message to be displayed
    waitFor(() => {
      // Assert that the error message is displayed
      const errorMessage = getByText(/Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number./i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
// Test: Should display an error message when email is not verified and verify email sent
test('should display an error message when email is not verified and verify email sent', async () => {
    const mockCreateUserWithEmailAndPassword = jest.fn(() => {
      return Promise.resolve({ user: { emailVerified: false } });
    });
    const mockSendEmailVerification = jest.fn(() => {
      // Simulate sending an email verification
      return Promise.resolve();
    });
  
    createUserWithEmailAndPassword.mockImplementation(mockCreateUserWithEmailAndPassword);
    sendEmailVerification.mockImplementation(mockSendEmailVerification);
  
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    const signUpButton = getByText('Sign Up');
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword1' } });
  
    fireEvent.click(signUpButton);
  
    // Wait for asynchronous actions to complete
    await waitFor(() => {
      const errorMessage = getByText(/You must verify your email to login./i);
      expect(errorMessage).toBeInTheDocument();
    });
  
    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'testPassword1');
    expect(mockSendEmailVerification).toHaveBeenCalled();
  });
  
test('should display an error message when email is not verified and verify email sent', async () => {
    const mockCreateUserWithEmailAndPassword = jest.fn(() => {
      return Promise.resolve({ user: { emailVerified: false } });
    });
    const mockSendEmailVerification = jest.fn(() => {
      // Simulate sending an email verification
      return Promise.resolve();
    });
  
    createUserWithEmailAndPassword.mockImplementation(mockCreateUserWithEmailAndPassword);
    sendEmailVerification.mockImplementation(mockSendEmailVerification);
  
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    const signUpButton = getByText('Sign Up');
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword1' } });
  
    fireEvent.click(signUpButton);
  
    // Wait for asynchronous actions to complete
    await waitFor(() => {
      const errorMessage = getByText(/You must verify your email to login./i);
      expect(errorMessage).toBeInTheDocument();
    });
  
    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'testPassword1');
    expect(mockSendEmailVerification).toHaveBeenCalled();
  });
  
  
  
  
  
//hello


//


/*
// Test: Should display an error message when passwords do not match
test('should display error message when passwords do not match', () => {
  const { getByPlaceholderText, getByText } = render(<SignUp />);
  const passwordInput = getByPlaceholderText('Enter your password');
  const confirmPasswordInput = getByPlaceholderText('Confirm your password');
  const signUpButton = getByText('Sign Up');

  // Simulate user input by changing the input field values
  fireEvent.change(passwordInput, { target: { value: 'Complex1' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword' } });

  // Simulate a form submission by clicking the sign-up button
  fireEvent.click(signUpButton);

  // Use `waitFor` to wait for the error message to be displayed
  waitFor(() => {
    // Assert that the error message is displayed
    const errorMessage = getByText(/Passwords do not match. Please try again/i);
    expect(errorMessage).toBeInTheDocument();
  });
});

// Test: Should not display error messages when password meets complexity requirements and passwords match
test('should not display error messages for valid passwords', () => {
  const { getByPlaceholderText, queryByText, getByText } = render(<SignUp />);
  const passwordInput = getByPlaceholderText('Enter your password');
  const confirmPasswordInput = getByPlaceholderText('Confirm your password');
  const signUpButton = getByText('Sign Up');

  // Simulate user input by changing the input field values
  fireEvent.change(passwordInput, { target: { value: 'Complex1' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'Complex1' } });

  // Simulate a form submission by clicking the sign-up button
  fireEvent.click(signUpButton);

  // Use `waitFor` to wait for error messages to disappear
  waitFor(() => {
    // Assert that the error messages are not displayed
    expect(queryByText(/Password must contain at least 8 characters/i)).toBeNull();
    expect(queryByText(/Passwords do not match. Please try again/i)).toBeNull();
  });
});

/* 
test('should display an error message when email is not verified', async () => {
    // Mock the createUserWithEmailAndPassword and sendEmailVerification functions to simulate an unverified user
    const mockCreateUserWithEmailAndPassword = jest.fn(() => {
      return Promise.resolve({ user: { emailVerified: false } });
    });
    const mockSendEmailVerification = jest.fn();
  
    // Override the default Firebase module methods with mock implementations
    createUserWithEmailAndPassword.mockImplementation(mockCreateUserWithEmailAndPassword);
    sendEmailVerification.mockImplementation(mockSendEmailVerification);
  
    const { getByPlaceholderText, getByText } = render(<SignUp />);
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    const signUpButton = getByText('Sign Up');
  
    // Simulate user input by changing the input field values
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword' } });
  
    // Simulate a form submission by clicking the Sign Up button
    fireEvent.click(signUpButton);
  
    // Wait for asynchronous actions to complete
    /*await waitFor(() => {
      // You can add assertions to check if the error message is displayed for unverified email
      const errorMessage = getByText('You must verify your email to login.');
      expect(errorMessage).toBeInTheDocument();
    });
   
  
    // Ensure that the createUserWithEmailAndPassword and sendEmailVerification functions were called
   // expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'testPassword');
   // expect(mockSendEmailVerification).toHaveBeenCalled();
  });
  */
 