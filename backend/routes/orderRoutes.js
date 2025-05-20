const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getOrders
} = require('../controllers/orderController');
const authMiddleware = require('../middleares/authMiddleware');
const adminMiddleware = require('../middleares/adminMiddleware');

// Routes that require authentication
router.route('/')
  .post(authMiddleware, createOrder)
  .get(authMiddleware, adminMiddleware, getOrders);

router.route('/myorders')
  .get(authMiddleware, getMyOrders);

router.route('/:id')
  .get(authMiddleware, getOrderById);

router.route('/:id/pay')
  .put(authMiddleware, updateOrderToPaid);

module.exports = router; 