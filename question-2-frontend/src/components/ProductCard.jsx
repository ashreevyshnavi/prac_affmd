import React from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Chip, Rating, Button
} from '@mui/material';
import { ShoppingCart, Store } from '@mui/icons-material';

const ProductCard = ({ product, onClick }) => {
  const getProductImage = (productName) => {
    const seed = productName.replace(/\s+/g, '').toLowerCase();
    return `https://picsum.photos/300/200?random=${seed}`;
  };

  const getAvailabilityColor = (availability) => {
    return availability === 'yes' ? 'success' : 'error';
  };

  const getDiscountColor = (discount) => {
    if (discount > 50) return 'error';
    if (discount > 20) return 'warning';
    return 'info';
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={getProductImage(product.productName)}
        alt={product.productName}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {product.productName}
        </Typography>
        
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Store fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {product.company}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Rating value={product.rating || 0} precision={0.1} size="small" readOnly />
          <Typography variant="body2" color="text.secondary">
            ({product.rating || 'N/A'})
          </Typography>
        </Box>
        
        <Box mb={2}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            ₹{product.price?.toLocaleString()}
          </Typography>
          {product.discount > 0 && (
            <Chip 
              label={`${product.discount}% OFF`} 
              size="small" 
              color={getDiscountColor(product.discount)}
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip 
            label={product.availability === 'yes' ? 'In Stock' : 'Out of Stock'}
            size="small"
            color={getAvailabilityColor(product.availability)}
            variant={product.availability === 'yes' ? 'filled' : 'outlined'}
          />
          
          <Button
            size="small"
            startIcon={<ShoppingCart />}
            disabled={product.availability !== 'yes'}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {product.availability === 'yes' ? 'Add to Cart' : 'Unavailable'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;