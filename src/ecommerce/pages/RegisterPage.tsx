import React from 'react';
import { Container, Paper, Typography } from '@mui/material';

const RegisterPage = () => {
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterPage;