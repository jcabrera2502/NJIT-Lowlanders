import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from '../components/Auth-Components/SignUp';

describe('SignUp component', () => {
    it('renders the form fields', () => {
        render(<SignUp />);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    });

    it('displays an error message when the email field is empty', () => {
        render(<SignUp />);
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
        expect(screen.getByText('Please enter your email.')).toBeInTheDocument();
    });

    it('displays an error message when the password field is empty', () => {
        render(<SignUp />);
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
        expect(screen.getByText('Please enter your password.')).toBeInTheDocument();
    });

    it('displays an error message when the confirm password field is empty', () => {
        render(<SignUp />);
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
        expect(screen.getByText('Please confirm your password.')).toBeInTheDocument();
    });

    it('displays an error message when the passwords do not match', () => {
        render(<SignUp />);
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'differentpassword' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
        expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });

    it('displays an error message when the first name field is empty', () => {
        render(<SignUp />);
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
        expect(screen.getByText('Please enter your first name.')).toBeInTheDocument();
    });

    it('displays an error message when the last name field is empty', () => {
        render(<SignUp />);
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
        expect(screen.getByText('Please enter your last name.')).toBeInTheDocument();
    });
});
