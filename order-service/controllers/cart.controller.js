const Cart = require('../models/cart');
const { validationResult } = require('express-validator');

/**
 * Get current user's cart
 */
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    
    // If cart doesn't exist, create an empty one
    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: []
      });
    }
    
    res.json({
      status: 'success',
      data: {
        cart,
        totalItems: cart.items.length,
        totalAmount: cart.calculateTotal()
      }
    });
  } catch (err) {
    console.error('Error in getCart:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

/**
 * Add item to cart
 */
const addItemToCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  try {
    const { productId, name, price, quantity, image } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    
    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: []
      });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId
    );
    
    if (existingItemIndex > -1) {
      // Item exists, update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name,
        price,
        quantity,
        image
      });
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.json({
      status: 'success',
      message: 'Item added to cart',
      data: {
        cart,
        totalItems: cart.items.length,
        totalAmount: cart.calculateTotal()
      }
    });
  } catch (err) {
    console.error('Error in addItemToCart:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

/**
 * Update cart item quantity
 */
const updateCartItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }
    
    // Find item in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId
    );
    
    if (existingItemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart'
      });
    }
    
    // Update quantity or remove if quantity is 0
    if (quantity > 0) {
      cart.items[existingItemIndex].quantity = quantity;
    } else {
      cart.items.splice(existingItemIndex, 1);
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.json({
      status: 'success',
      message: 'Cart updated',
      data: {
        cart,
        totalItems: cart.items.length,
        totalAmount: cart.calculateTotal()
      }
    });
  } catch (err) {
    console.error('Error in updateCartItem:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

/**
 * Remove item from cart
 */
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }
    
    // Remove item
    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.updatedAt = Date.now();
    
    await cart.save();
    
    res.json({
      status: 'success',
      message: 'Item removed from cart',
      data: {
        cart,
        totalItems: cart.items.length,
        totalAmount: cart.calculateTotal()
      }
    });
  } catch (err) {
    console.error('Error in removeCartItem:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

/**
 * Clear the entire cart
 */
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }
    
    cart.items = [];
    cart.updatedAt = Date.now();
    
    await cart.save();
    
    res.json({
      status: 'success',
      message: 'Cart cleared',
      data: {
        cart,
        totalItems: 0,
        totalAmount: 0
      }
    });
  } catch (err) {
    console.error('Error in clearCart:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};