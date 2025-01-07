import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ProductGrid from '../components/product/ProductGrid';
import { products } from '../data/products';

const ProductListingPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Featured Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover our curated collection of premium products
        </Typography>
      </Box>
      <ProductGrid products={products} />
    </Container>
  );
};

export default ProductListingPage;