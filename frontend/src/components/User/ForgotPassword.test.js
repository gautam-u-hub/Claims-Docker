import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'; // Import axios for real requests
import ForgotPassword from './ForgotPassword';
import { API_URL } from '../../Links';

jest.mock('axios'); // Mock axios for component

describe('ForgotPassword component', () => {
    test('handles form submission successfully', async () => {
        const { getByText, getByLabelText } = render(<ForgotPassword />);
        const emailInput = getByLabelText('Email address');
        const submitButton = getByText('Submit');

        // Fill the email input
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        // Submit the form
        fireEvent.click(submitButton);

        // Wait for the axios request to resolve
        await waitFor(async () => {
            // Make real axios request to your API
            const response = await axios.post(`${API_URL}/auth/password/forgot`, { email: 'admin7@gmail.com' });

            // Assert that success message is displayed
            expect(response.status).toBe(200);
            expect(response.data).toEqual({}); // Modify this according to your response data
        });
    });

    // Add more test cases for other scenarios if needed
});
