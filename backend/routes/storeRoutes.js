const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/storeController');
const authMiddleware = require('../middleares/authMiddleware');
const adminMiddleware = require('../middleares/adminMiddleware');

// Public routes
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);

// Temporary public route for creating products (REMOVE IN PRODUCTION)
router.route('/public/create').post(createProduct);

// Admin routes
router.route('/').post(authMiddleware, adminMiddleware, createProduct);
router.route('/:id')
  .put(authMiddleware, adminMiddleware, updateProduct)
  .delete(authMiddleware, adminMiddleware, deleteProduct);

module.exports = router; 