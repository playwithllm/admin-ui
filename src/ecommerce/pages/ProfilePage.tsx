import React from 'react';
import { Container, Typography, Button } from '@mui/material';

import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {

  const { user, logout } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      <Typography variant="h6">Name: {user?.name}</Typography>
      <Typography variant="h6">Email: {user?.email}</Typography>
      <Button variant="contained" color="primary" onClick={logout}>
        Logout
      </Button>
    </Container>
  );
};

export default ProfilePage;
