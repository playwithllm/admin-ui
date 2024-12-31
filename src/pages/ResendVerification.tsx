import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export const ResendVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/auth/resend-verification', { email });
      setMessage(response.data.message || 'Verification email resent successfully');
    } catch (err) {
      setError('Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4, // Added padding
          boxShadow: 3, // Added box shadow
          borderRadius: 2, // Rounded corners
          backgroundColor: 'background.paper', // Set background color
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Resend Verification Email
        </Typography>
        <Box component="form" onSubmit={handleResend} sx={{ mt: 1, width: '100%' }}>
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }} // Increased padding
            disabled={loading}
          >
            {loading ? 'Resending...' : 'Resend Verification Email'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/signin')}
          >
            Back to Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
