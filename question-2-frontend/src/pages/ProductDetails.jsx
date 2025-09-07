import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid, Typography, Paper, Box, Chip, Rating, Button, Divider,
  CircularProgress, Alert, Card, CardMedia
} from '@mui/material';
import { 
  ArrowBack, ShoppingCart, Store, LocalOffer, 
  Inventory, Star, AttachMoney 
} from '@mui/icons-material';
import { productAPI } from '../services/api';

const ProductDetails = () => {
  const { category, productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [category, productId]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const productData = await productAPI.getProductById(category, productId);
      setProduct(productData);
    } catch (err) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (productName) => {
    const seed = productName.replace(/\s+/g, '').toLowerCase();
    return `https://picsum.photos/600/400?random=${seed}`;
  };

  const getAvailabilityColor = (availability) => {
    return availability === 'yes' ? 'success' : 'error';
  };

  const getDiscountColor = (discount) => {
    if (discount > 50) return 'error';
    if (discount > 20) return 'warning';
    return 'info';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(`/categories/${category}`)}
          sx={{ mb: 2 }}
        >
          Back to Products
        </Button>
        <Alert severity="error">
          {error || 'Product not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(`/categories/${category}`)}
        sx={{ mb: 3 }}
      >
        Back to {category} Products
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={getProductImage(product.productName)}
              alt={product.productName}
              sx={{ 
                height: { xs: 300, md: 400 },
                objectFit: 'cover'
              }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {product.productName}
            </Typography>

            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Store color="action" />
                <Typography variant="h6" color="text.secondary">
                  {product.company}
                </Typography>
              </Box>
              <Chip label={category} variant="outlined" />
            </Box>

            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Rating value={product.rating || 0} precision={0.1} readOnly />
              <Typography variant="body1" color="text.secondary">
                ({product.rating || 'N/A'}) Rating
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box mb={3}>
              <Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
                ₹{product.price?.toLocaleString()}
              </Typography>
              
              {product.discount > 0 && (
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip 
                    icon={<LocalOffer />}
                    label={`${product.discount}% OFF`} 
                    color={getDiscountColor(product.discount)}
                    size="medium"
                  />
                  <Typography variant="body2" color="text.secondary">
                    You save ₹{Math.round((product.price * product.discount) / 100).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} mb={3}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Inventory color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Availability:
                  </Typography>
                </Box>
                <Chip 
                  label={product.availability === 'yes' ? 'In Stock' : 'Out of Stock'}
                  color={getAvailabilityColor(product.availability)}
                  variant={product.availability === 'yes' ? 'filled' : 'outlined'}
                  sx={{ mt: 0.5 }}
                />
              </Grid>

              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Star color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Rating:
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  {product.rating || 'N/A'} / 5
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AttachMoney color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Price:
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  ₹{product.price?.toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocalOffer color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Discount:
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  {product.discount || 0}%
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                disabled={product.availability !== 'yes'}
                sx={{ flex: 1 }}
                onClick={() => {
                  alert('Product added to cart!');
                }}
              >
                {product.availability === 'yes' ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                disabled={product.availability !== 'yes'}
                sx={{ flex: 1 }}
                onClick={() => {
                  alert('Redirecting to checkout...');
                }}
              >
                Buy Now
              </Button>
            </Box>

            <Box mt={2}>
              <Typography variant="caption" color="text.secondary">
                Product ID: {product.id}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;