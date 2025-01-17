import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, TextField, Button, IconButton } from '@mui/material';
import ProductGrid from '../components/product/ProductGrid';

import api from '../../utils/api';
import SearchIcon from '@mui/icons-material/Search';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import ClearIcon from '@mui/icons-material/Clear';

const ProductListingPage = () => {

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'initial' | 'text' | 'image'>('initial');
  
  // Hidden file input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (selectedImage) {
      setSearchMode('image');
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await api.post('/api/v1/products/search/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts(response.data);
    } else {
      setSearchMode(searchQuery ? 'text' : 'initial');
      const response = await api.get('/api/v1/products/search', {
        params: searchQuery ? { keyword: searchQuery } : undefined
      });
      setProducts(response.data);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Clear text search when image is selected
      setSearchQuery('');
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = async () => {
    // Clear all search states
    setSearchQuery('');
    setSelectedImage(null);
    setImagePreview(null);
    setSearchMode('initial');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Reset to initial products
    const response = await api.get('/api/v1/products/search');
    setProducts(response.data);
  };

  useEffect(() => {
    handleSearch(); // Initial load without search query
    
    // Cleanup preview URL on unmount
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
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
          disabled={!!selectedImage}
        />
        
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageSelect}
          ref={fileInputRef}
        />
        
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          color={selectedImage ? 'primary' : 'default'}
          sx={{ border: 1, borderColor: 'divider' }}
        >
          <ImageSearchIcon />
        </IconButton>

        <Button 
          variant="contained" 
          onClick={handleSearch}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>

        {(searchQuery || selectedImage) && (
          <Button
            variant="outlined"
            onClick={handleClear}
            startIcon={<ClearIcon />}
            color="inherit"
          >
            Clear
          </Button>
        )}
      </Box>

      {/* Search Status Message */}
      {searchMode !== 'initial' && (
        <Box sx={{ mb: 3, mt: 2 }}>
          <Typography 
            variant="body1" 
            color="primary"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              padding: '8px 16px',
              borderRadius: 1,
              width: 'fit-content'
            }}
          >
            {searchMode === 'text' ? (
              <>
                <SearchIcon fontSize="small" />
                {`Showing results for "${searchQuery}"`}
              </>
            ) : (
              <>
                <ImageSearchIcon fontSize="small" />
                Showing visually similar products
              </>
            )}
          </Typography>
        </Box>
      )}

      {imagePreview && (
        <Box sx={{ mb: 3, position: 'relative', display: 'inline-block' }}>
          <img 
            src={imagePreview} 
            alt="Search preview" 
            style={{ maxHeight: 100, maxWidth: 100, objectFit: 'contain' }} 
          />
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: 'background.paper',
              '&:hover': { backgroundColor: 'background.default' },
            }}
            onClick={handleClearImage}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <ProductGrid products={products} />
    </Container>
  );
};

export default ProductListingPage;
