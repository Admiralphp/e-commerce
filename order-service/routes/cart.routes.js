const express = require('express');
const { check } = require('express-validator');
const cartController = require('../controllers/cart.controller');
const auth = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(auth);

/**
 * @route   GET /api/cart
 * @desc    Get current user's cart
 * @access  Private
 */
router.get('/', cartController.getCart);

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Private
 */
router.post('/', [
  check('productId', 'Product ID is required').notEmpty(),
  check('name', 'Product name is required').notEmpty(),
  check('price', 'Price must be a positive number').isFloat({ min: 0 }),
  check('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
], cartController.addItemToCart);

/**
 * @route   PUT /api/cart
 * @desc    Update cart item quantity
 * @access  Private
 */
router.put('/', [
  check('productId', 'Product ID is required').notEmpty(),
  check('quantity', 'Quantity must be a number').isInt()
], cartController.updateCartItem);

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/:productId', cartController.removeCartItem);

/**
 * @route   DELETE /api/cart
 * @desc    Clear cart
 * @access  Private
 */
router.delete('/', cartController.clearCart);

module.exports = router;