const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Cart Item Schema (embedded document)
const CartItemSchema = new Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  image: {
    type: String,
    default: ''
  }
});

// Cart Schema
const CartSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  items: [CartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total cart value
CartSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

module.exports = mongoose.model('Cart', CartSchema);