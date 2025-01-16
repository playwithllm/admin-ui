import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Rating, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';
import { ECOMMERCE_ROUTES } from '../../constants/routes';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart: addItem } = useCart();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.images[0]??''}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2
          }}
        >
          {product.description}
        </Typography>        
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          ${product.price.toFixed(2)}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(ECOMMERCE_ROUTES.PRODUCT_DETAIL(product.id), {
              state: { product }
            })}
          >
            Details
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShoppingCart size={20} />}
            onClick={() => addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.image
            })}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
