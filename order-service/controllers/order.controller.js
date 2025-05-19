const Order = require('../models/order');
const Cart = require('../models/cart');
const { validationResult } = require('express-validator');

/**
 * Create a new order (checkout process)
 */
const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  try {
    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot create order with empty cart'
      });
    }
    
    // Create new order from cart
    const { shippingAddress, paymentMethod, notes } = req.body;
    
    const order = new Order({
      userId: req.user.id,
      items: cart.items,
      totalAmount: cart.calculateTotal(),
      shippingAddress,
      paymentMethod,
      notes,
      status: 'pending'
    });
    
    await order.save();
    
    // Clear the cart after order is created
    cart.items = [];
    await cart.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: { order }
    });
  } catch (err) {
    console.error('Error in createOrder:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

/**
 * Get all orders for current user
 */
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      data: { orders }
    });
  } catch (err) {
    console.error('Error in getUserOrders:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

/**
 * Get specific order by ID (user can only see their own orders)
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to user
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this order'
      });
    }
    
    res.json({
      status: 'success',
      data: { order }
    });
  } catch (err) {
    console.error('Error in getOrderById:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

/**
 * Cancel order (only if status is 'pending')
 */
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to user
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to cancel this order'
      });
    }
    
    // Check if order can be cancelled
    if (order.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot cancel order that is not in pending status'
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json({
      status: 'success',
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (err) {
    console.error('Error in cancelOrder:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

/**
 * Admin: Get all orders
 */
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const query = status ? { status } : {};
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalOrders = await Order.countDocuments(query);
    
    res.json({
      status: 'success',
      data: { 
        orders,
        pagination: {
          total: totalOrders,
          page: parseInt(page),
          pages: Math.ceil(totalOrders / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (err) {
    console.error('Error in getAllOrders:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

/**
 * Admin: Update order status
 */
const updateOrderStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    
    order.status = status;
    await order.save();
    
    res.json({
      status: 'success',
      message: 'Order status updated',
      data: { order }
    });
  } catch (err) {
    console.error('Error in updateOrderStatus:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};