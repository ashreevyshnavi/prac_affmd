import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid, Typography, Paper, Drawer, Box, useMediaQuery, useTheme,
  FormControl, InputLabel, Select, MenuItem, TextField, Button,
  Pagination, Chip, CircularProgress, Alert
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const AllProducts = () => {
  const { category: selectedCategory } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const [filters, setFilters] = useState({
    category: selectedCategory || 'Laptop',
    top: 10,
    minPrice: 0,
    maxPrice: 100000,
    sortBy: 'price',
    order: 'asc',
    company: '',
    rating: '',
    availability: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filters.category) {
      loadProducts();
    }
  }, [filters, currentPage]);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== filters.category) {
      setFilters(prev => ({ ...prev, category: selectedCategory }));
      setCurrentPage(1);
    }
  }, [selectedCategory]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, companiesData] = await Promise.all([
        productAPI.getCategories(),
        productAPI.getCompanies()
      ]);
      setCategories(categoriesData);
      setCompanies(companiesData);
    } catch (err) {
      setError('Failed to load initial data');
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productAPI.getProducts(filters.category, {
        ...filters,
        page: currentPage
      });
      
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setTotalProducts(response.totalProducts);
    } catch (err) {
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    
    if (key === 'category') {
      navigate(`/categories/${value}`);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: filters.category,
      top: 10,
      minPrice: 0,
      maxPrice: 100000,
      sortBy: 'price',
      order: 'asc',
      company: '',
      rating: '',
      availability: ''
    });
    setCurrentPage(1);
  };

  const FilterPanel = () => (
    <Paper sx={{ p: 2, height: 'fit-content' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Filters</Typography>
        <Button startIcon={<Clear />} onClick={clearFilters} size="small">
          Clear
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Company</InputLabel>
            <Select
              value={filters.company}
              label="Company"
              onChange={(e) => handleFilterChange('company', e.target.value)}
            >
              <MenuItem value="">All Companies</MenuItem>
              {companies.map(comp => (
                <MenuItem key={comp} value={comp}>{comp}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Min Price"
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Max Price"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Min Rating"
            type="number"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Availability</InputLabel>
            <Select
              value={filters.availability}
              label="Availability"
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="yes">In Stock</MenuItem>
              <MenuItem value="no">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="discount">Discount</MenuItem>
              <MenuItem value="productName">Name</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Order</InputLabel>
            <Select
              value={filters.order}
              label="Order"
              onChange={(e) => handleFilterChange('order', e.target.value)}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Products per page"
            type="number"
            inputProps={{ min: 5, max: 50 }}
            value={filters.top}
            onChange={(e) => handleFilterChange('top', e.target.value)}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Box>
      {isMobile && (
        <Button
          startIcon={<FilterList />}
          onClick={() => setDrawerOpen(true)}
          sx={{ mb: 2 }}
        >
          Filters
        </Button>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          {isMobile ? (
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box sx={{ width: 300, p: 2 }}>
                <FilterPanel />
              </Box>
            </Drawer>
          ) : (
            <FilterPanel />
          )}
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Box mb={2}>
            <Typography variant="h4" gutterBottom>
              {filters.category} Products
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              <Chip label={`Total: ${totalProducts}`} />
              <Chip label={`Page: ${currentPage}/${totalPages}`} />
              {filters.company && <Chip label={`Company: ${filters.company}`} />}
              {filters.rating && <Chip label={`Min Rating: ${filters.rating}`} />}
            </Box>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product.id}>
                    <ProductCard 
                      product={product} 
                      onClick={() => navigate(`/categories/${filters.category}/products/${product.id}`)}
                    />
                  </Grid>
                ))}
              </Grid>
              
              {products.length === 0 && !loading && (
                <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                  No products found. Try adjusting your filters.
                </Typography>
              )}
              
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllProducts;