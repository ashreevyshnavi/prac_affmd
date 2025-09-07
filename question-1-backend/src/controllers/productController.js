const ecommerceService = require('../services/ecommerceService');

class ProductController {
  async getProducts(req, res) {
    try {
      const { categoryname } = req.params;
      const {
        top = 10,
        minPrice = 0,
        maxPrice = 100000,
        page = 1,
        sortBy = 'price',
        order = 'asc',
        company,
        rating,
        availability
      } = req.query;

      const validCategories = [
        'Phone', 'Computer', 'TV', 'Earphone', 'Tablet', 'Charger',
        'Mouse', 'Keypad', 'Bluetooth', 'Pendrive', 'Remote', 'Speaker',
        'Headset', 'Laptop', 'PC'
      ];

      if (!validCategories.includes(categoryname)) {
        return res.status(400).json({
          error: 'Invalid category',
          validCategories
        });
      }

      let products = await ecommerceService.getAllProducts(
        categoryname,
        parseInt(top),
        parseInt(minPrice),
        parseInt(maxPrice)
      );

      if (company) {
        products = products.filter(p => p.company === company);
      }

      if (rating) {
        products = products.filter(p => p.rating >= parseFloat(rating));
      }

      if (availability) {
        if (availability === 'yes') {
          products = products.filter(p => p.availability === 'yes');
        } else if (availability === 'no') {
          products = products.filter(p => p.availability !== 'yes');
        }
      }

      products = ecommerceService.sortProducts(products, sortBy, order);

      const paginatedResult = ecommerceService.paginateProducts(
        products,
        parseInt(page),
        parseInt(top)
      );

      res.json(paginatedResult);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch products',
        message: error.message
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { categoryname, productid } = req.params;

      const products = await ecommerceService.getAllProducts(categoryname, 50);
      const product = products.find(p => p.id === productid);

      if (!product) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch product',
        message: error.message
      });
    }
  }

  async getCategories(req, res) {
    const categories = [
      'Phone', 'Computer', 'TV', 'Earphone', 'Tablet', 'Charger',
      'Mouse', 'Keypad', 'Bluetooth', 'Pendrive', 'Remote', 'Speaker',
      'Headset', 'Laptop', 'PC'
    ];

    res.json({ categories });
  }

  async getCompanies(req, res) {
    const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
    res.json({ companies });
  }
}

module.exports = new ProductController();