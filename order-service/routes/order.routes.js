const express = require('express');
const { check } = require('express-validator');
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// All order routes require authentication
router.use(auth);

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', [
  check('shippingAddress', 'Shipping address is required').isObject(),
  check('shippingAddress.name', 'Name is required').notEmpty(),
  check('shippingAddress.street', 'Street address is required').notEmpty(),
  check('shippingAddress.city', 'City is required').notEmpty(),
  check('shippingAddress.zipCode', 'Zip code is required').notEmpty(),
  check('shippingAddress.country', 'Country is required').notEmpty(),
  check('paymentMethod', 'Valid payment method is required').isIn(['credit_card', 'paypal', 'bank_transfer'])
], orderController.createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get current user's orders
 * @access  Private
 */
router.get('/', orderController.getUserOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', orderController.getOrderById);

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel an order
 * @access  Private
 */
router.put('/:id/cancel', orderController.cancelOrder);

/**
 * Admin routes
 */

/**
 * @route   GET /api/orders/admin/all
 * @desc    Get all orders (admin only)
 * @access  Private/Admin
 */
router.get('/admin/all', admin, orderController.getAllOrders);

/**
 * @route   PUT /api/orders/admin/:id
 * @desc    Update order status (admin only)
 * @access  Private/Admin
 */
router.put('/admin/:id', [
  admin,
  check('status', 'Valid status is required').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
], orderController.updateOrderStatus);

module.exports = router;