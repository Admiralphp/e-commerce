const express = require('express');
const { check } = require('express-validator');
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// All order routes require authentication
router.use(auth);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - name
 *                   - street
 *                   - city
 *                   - zipCode
 *                   - country
 *                 properties:
 *                   name:
 *                     type: string
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, paypal, bank_transfer]
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
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
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Not authorized
 */
router.get('/', orderController.getUserOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Order not found
 */
router.get('/:id', orderController.getOrderById);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Order not found
 */
router.put('/:id/cancel', orderController.cancelOrder);

/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 */
router.get('/admin/all', admin, orderController.getAllOrders);

/**
 * @swagger
 * /api/orders/admin/{id}:
 *   put:
 *     summary: Update order status (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 */
router.put('/admin/:id', [
  admin,
  check('status', 'Valid status is required').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
], orderController.updateOrderStatus);

module.exports = router;