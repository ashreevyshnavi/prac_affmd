import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const productAPI = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data.categories;
  },

  getCompanies: async () => {
    const response = await api.get('/categories/companies');
    return response.data.companies;
  },

  getProducts: async (category, filters = {}) => {
    const {
      top = 10,
      page = 1,
      minPrice = 0,
      maxPrice = 100000,
      sortBy = 'price',
      order = 'asc',
      company,
      rating,
      availability
    } = filters;

    const params = {
      top,
      page,
      minPrice,
      maxPrice,
      sortBy,
      order
    };

    if (company) params.company = company;
    if (rating) params.rating = rating;
    if (availability) params.availability = availability;

    const response = await api.get(`/categories/${category}/products`, { params });
    return response.data;
  },

  getProductById: async (category, productId) => {
    const response = await api.get(`/categories/${category}/products/${productId}`);
    return response.data;
  }
};

export default api;