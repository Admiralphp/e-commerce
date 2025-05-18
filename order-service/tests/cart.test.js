// Sample test file for cart functionality
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Cart = require('../models/cart');

// Mock JWT authentication middleware
jest.mock('../middleware/auth', () => {
  return (req, res, next) => {
    req.user = { id: 'test-user-id' };
    next();
  };
});

describe('Cart API', () => {
  beforeEach(async () => {
    // Clear cart collection before each test
    await Cart.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/cart', () => {
    it('should return empty cart for new user', async () => {
      const res = await request(app).get('/api/cart');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.cart.items).toHaveLength(0);
      expect(res.body.data.totalAmount).toBe(0);
    });
  });

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      const cartItem = {
        productId: 'product-1',
        name: 'Test Product',
        price: 19.99,
        quantity: 1,
        image: 'test.jpg'
      };

      const res = await request(app)
        .post('/api/cart')
        .send(cartItem);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.cart.items).toHaveLength(1);
      expect(res.body.data.cart.items[0].productId).toBe(cartItem.productId);
      expect(res.body.data.totalAmount).toBe(cartItem.price * cartItem.quantity);
    });
  });
});