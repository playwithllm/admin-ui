import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import ProductGrid from '../components/product/ProductGrid';

import api from '../../utils/api';
import SearchIcon from '@mui/icons-material/Search';

const ProductListingPage = () => {

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    const response = await api.get('/api/v1/products/search', {
      params: searchQuery ? { keyword: searchQuery } : undefined
    });
    setProducts(response.data);
  };

  useEffect(() => {
    handleSearch(); // Initial load without search query
  }, []);

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
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          sx={{ maxWidth: 500 }}
        />
        <Button 
          variant="contained" 
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Box>

      <ProductGrid products={products} />
    </Container>
  );
};

export default ProductListingPage;
