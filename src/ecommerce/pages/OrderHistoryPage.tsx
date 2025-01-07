import React from 'react';
import { Container, Typography } from '@mui/material';

const OrderHistoryPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Order History
      </Typography>
    </Container>
  );
};

export default OrderHistoryPage;