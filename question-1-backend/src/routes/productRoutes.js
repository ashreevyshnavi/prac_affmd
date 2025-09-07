const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getCategories);
router.get('/companies', productController.getCompanies);
router.get('/:categoryname/products', productController.getProducts);
router.get('/:categoryname/products/:productid', productController.getProductById);

module.exports = router;