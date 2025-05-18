// Sample test file for order functionality
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Order = require('../models/order');
const Cart = require('../models/cart');

// Mock JWT authentication middleware
jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    req.user = { id: 'test-user-id' };
    next();
  };
});

// Mock admin middleware
jest.mock('../middleware/admin', () => {
  return (req, res, next) => {
    req.user.role = 'admin';
    next();
  };
});

describe('Order API', () => {
  beforeEach(async () => {
    // Clear order collection before each test
    await Order.deleteMany({});
    await Cart.deleteMany({});
    
    // Create a cart for testing
    const cart = new Cart({
      userId: 'test-user-id',
      items: [
        {
          productId: 'product-1',
          name: 'Test Product',
          price: 19.99,
          quantity: 2,
          image: 'test.jpg'
        }
      ]
    });
    
    await cart.save();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const orderData = {
        shippingAddress: {
          name: 'Test User',
          street: '123 Test Street',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'Test Country',
          phone: '123456789'
        },
        paymentMethod: 'credit_card',
        notes: 'Test order'
      };

      const res = await request(app)
        .post('/api/orders')
        .send(orderData);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.order.items).toHaveLength(1);
      expect(res.body.data.order.totalAmount).toBe(39.98);
      expect(res.body.data.order.status).toBe('pending');
    });
  });
});