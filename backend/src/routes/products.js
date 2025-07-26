const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProductQuantity,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getProductAnalytics
} = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');
const { validate, validateQuery, productSchema, updateQuantitySchema, paginationSchema } = require('../middleware/validation');

const router = express.Router();

router.post('/', auth, validate(productSchema), createProduct);
router.get('/', auth, validateQuery(paginationSchema), getProducts);
router.get('/analytics', auth, getProductAnalytics);
router.get('/low-stock', auth, getLowStockProducts);
router.get('/:id', auth, getProduct);
router.put('/:id/quantity', auth, validate(updateQuantitySchema), updateProductQuantity);
router.put('/:id', auth, validate(productSchema), updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
