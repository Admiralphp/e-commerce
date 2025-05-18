# Order Service for Phone Accessories E-commerce

This service is responsible for managing shopping carts and orders within the microservices architecture of the phone accessories e-commerce application.

## Features

- Shopping cart management (add, update, remove items)
- Order creation and management
- User order history
- Admin order management
- JWT authentication

## Tech Stack

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- REST API design

## API Endpoints

### Cart Endpoints

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Order Endpoints

- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id/cancel` - Cancel an order
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `PUT /api/orders/admin/:id` - Update order status (admin only)

## Running the Service

1. Install dependencies: `npm install`
2. Set environment variables in `.env`
3. Start the service: `npm start`
4. Development mode: `npm run dev`

## Testing

Run tests with: `npm test`