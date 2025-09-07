const axios = require('axios');

class EcommerceService {
  constructor() {
    this.baseURL = 'http://20.244.56.144/test';
    this.companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    try {
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const authData = {
        companyName: process.env.COMPANY_NAME,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        ownerName: process.env.OWNER_NAME,
        ownerEmail: process.env.OWNER_EMAIL,
        rollNo: process.env.ROLL_NO
      };

      const response = await axios.post(`${this.baseURL}/auth`, authData);
      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      throw new Error('Authentication failed: ' + error.message);
    }
  }

  async fetchProductsFromCompany(company, category, top = 10, minPrice = 0, maxPrice = 100000) {
    try {
      const token = await this.authenticate();
      
      const response = await axios.get(
        `${this.baseURL}/companies/${company}/categories/${category}/products`,
        {
          params: { top, minPrice, maxPrice },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      return response.data.map(product => ({
        ...product,
        company,
        id: this.generateProductId(company, product.productName, product.price)
      }));
    } catch (error) {
      console.error(`Error fetching from ${company}:`, error.message);
      return [];
    }
  }

  async getAllProducts(category, top = 10, minPrice = 0, maxPrice = 100000) {
    const promises = this.companies.map(company => 
      this.fetchProductsFromCompany(company, category, top, minPrice, maxPrice)
    );

    try {
      const results = await Promise.all(promises);
      return results.flat();
    } catch (error) {
      throw new Error('Failed to fetch products: ' + error.message);
    }
  }

  generateProductId(company, productName, price) {
    const timestamp = Date.now();
    const hash = this.simpleHash(`${company}_${productName}_${price}_${timestamp}`);
    return `${company}_${hash}`;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  sortProducts(products, sortBy = 'price', order = 'asc') {
    return products.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (order === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }

  paginateProducts(products, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      products: products.slice(startIndex, endIndex),
      totalProducts: products.length,
      currentPage: page,
      totalPages: Math.ceil(products.length / limit),
      hasNext: endIndex < products.length,
      hasPrev: page > 1
    };
  }
}

module.exports = new EcommerceService();