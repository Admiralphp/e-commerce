# Product Catalog Microservice

A microservice for managing a product catalog in an e-commerce application for phone accessories.

## Features

- Admin CRUD operations for products
- Public API for browsing, filtering, and searching products
- JWT authentication for admin routes
- RESTful API design

## Tech Stack

- Go (1.20+)
- Fiber web framework
- PostgreSQL (Neon)
- GORM ORM
- JWT authentication

## Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Install dependencies: `go mod download`
4. Run the application: `go run main.go`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Authenticate and get a JWT token

### Public API

- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories` - Get all product categories

### Admin API (protected)

- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Filtering Products

The `/api/products` endpoint supports the following query parameters:

- `category` - Filter by category
- `min_price` - Minimum price
- `max_price` - Maximum price
- `search` - Search in name and description
- `sort_by` - Field to sort by (e.g., price, name)
- `sort_dir` - Sort direction (asc or desc)
- `page` - Page number for pagination
- `limit` - Number of items per page

## Docker

Build and run the application using Docker:

```
docker build -t product-catalog .
docker run -p 8080:8080 product-catalog
```

## API Examples

### Login as admin

```
POST /api/auth/login
{
  "username": "admin",
  "password": "secure_password"
}
```

### Create a product

```
POST /api/admin/products
Authorization: Bearer {token}
{
  "name": "Premium Phone Case",
  "description": "High-quality protection for your device",
  "price": 29.99,
  "category": "cases",
  "image_url": "https://example.com/images/case.jpg",
  "stock": 100
}
```

### Get products with filtering

```
GET /api/products?category=cases&min_price=20&max_price=50&sort_by=price&sort_dir=asc&page=1&limit=10
```