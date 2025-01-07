import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, isAuthenticated } = useAuth(); // Assuming you have a useAuth hook that provides the current user information

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            E-Commerce Store
          </Typography>
          <Button color="inherit" onClick={() => navigate('/products')}>
            Products
          </Button>
          <Button color="inherit" onClick={() => navigate('/cart')} sx={{ mr: 1 }}>
            <Badge badgeContent={getCartCount()} color="error" overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <ShoppingCart size={20} />
            </Badge>
          </Button>
          {isAuthenticated ? (
            <Button color="inherit" onClick={() => navigate('/profile')}>
              <User size={20} />
            </Button>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
