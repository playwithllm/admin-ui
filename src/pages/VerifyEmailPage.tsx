import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import api from '../utils/api';
import { Alert } from '@mui/material'; // Added Alert import

export const VerifyEmailPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Added navigate
    const [success, setSuccess] = useState(''); // Added success state
    const [error, setError] = useState(''); // Added error state

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            api.get('/api/auth/verify-email?token=' + token)
                .then(async response => {
                    console.log('Verify email response:', response);
                    setSuccess('Email verified successfully. You can now log in.');
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                    navigate('/signin'); // Navigate to sign in page
                })
                .catch(async error => {
                    console.error('Verify email error:', error);
                    setError('Verification failed. Please try again or request a new verification email.');
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                    navigate('/signin'); // Navigate to sign in page
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            Verifying your email...
        </div>
    );
};
