const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingPrice,
    taxPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = new Order({
    user: req.user.userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  console.log(`[ORDER] Created new order ${createdOrder._id} for user ${req.user.userId}`);
  res.status(201).json(createdOrder);
});

// @desc    Get all orders for a user
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  console.log(`[ORDER] Fetching orders for user ${req.user.userId}`);
  const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order && (order.user.toString() === req.user.userId || req.user.isAdmin)) {
    console.log(`[ORDER] Retrieved order ${order._id}`);
    res.json(order);
  } else {
    console.log(`[ORDER] Order not found or unauthorized access: ${req.params.id}`);
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'Processing';
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    console.log(`[ORDER] Order ${updatedOrder._id} marked as paid`);
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  console.log(`[ORDER] Admin ${req.user.userId} retrieving all orders`);
  const orders = await Order.find({}).populate('user', 'id username email');
  res.json(orders);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getOrders
}; 