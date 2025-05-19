# 📱 Phone Accessories E-Commerce Platform

A modern, containerized microservices e-commerce platform for selling phone accessories. Built with scalability and maintainability in mind using the latest technologies and best practices.

---

## 🏗 Architecture Overview

```
                    +----------------+
                    |                |
                    |  Nginx Gateway |
                    |                |
                    +-------+--------+
                            |
        +-------------------+-------------------+
        |                   |                   |
+-------v-------+   +-------v-------+   +-------v-------+
|               |   |               |   |               |
| Auth Service  |   | Product Svc   |   | Order Service |
| (Node.js)     |   | (Go)          |   | (Node.js)     |
|               |   |               |   |               |
+-------+-------+   +-------+-------+   +-------+-------+
        |                   |                   |
+-------v-------+   +-------v-------+   +-------v-------+
|               |   |               |   |               |
| MongoDB       |   | PostgreSQL    |   | MongoDB       |
|               |   |               |   |               |
+---------------+   +---------------+   +---------------+
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop (or Docker Engine + Docker Compose)
- PowerShell
- Administrator privileges (for hosts file modification)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Admiralphp/e-commerce.git
cd e-commerce/PIC
```

2. Start all services:
```powershell
./start-all-services.ps1
```

3. Verify services health:
```powershell
./health-check.ps1
```

## 🌐 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Customer Frontend | http://localhost:3001 | Next.js based customer interface |
| Admin Dashboard | http://localhost:4200 | Angular admin interface |
| API Gateway | http://api.phoneaccessories.local | Nginx API Gateway |
| MongoDB Express | http://localhost:8081 | MongoDB admin interface |
| pgAdmin | http://localhost:5050 | PostgreSQL admin interface |

## 🔑 Default Credentials

### Database Administration
- MongoDB Express:
  - Username: root
  - Password: rootpassword

- pgAdmin:
  - Email: admin@example.com
  - Password: admin
  - PostgreSQL connection:
    - Host: postgres
    - Port: 5432
    - Username: postgres
    - Password: postgres

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js |
| Admin Dashboard | Angular 17+ |
| Auth Service | Node.js + Express + MongoDB |
| Product Service | Go + Fiber + PostgreSQL |
| Order Service | Node.js + MongoDB |
| API Gateway | Nginx |
| Security | JWT + bcrypt |
| Deployment | Docker + Docker Compose |

## 📚 API Documentation

### Auth Service (Port 3000)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Authenticate user
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Product Service (Port 8080)
- Public endpoints:
  - `GET /api/products` - List all products
  - `GET /api/products/:id` - Get product details
  - `GET /api/products/categories` - List categories

- Admin endpoints (JWT required):
  - `POST /api/admin/products` - Create product
  - `PUT /api/admin/products/:id` - Update product
  - `DELETE /api/admin/products/:id` - Delete product

### Order Service (Port 3002)
- Cart endpoints:
  - `GET /api/cart` - Get user's cart
  - `POST /api/cart` - Add item to cart
  - `PUT /api/cart` - Update cart
  - `DELETE /api/cart/:productId` - Remove item

- Order endpoints:
  - `POST /api/orders` - Create order
  - `GET /api/orders` - List user's orders
  - `GET /api/orders/:id` - Get order details
  - `PUT /api/orders/:id/cancel` - Cancel order

## 🛠 Development Commands

### Service Management
```powershell
# Start all services
./start-all-services.ps1

# Stop all services
./stop-all-services.ps1

# Check health status
./health-check.ps1

# View logs
docker logs phone-accessories-[service-name]
```

### Rebuild Specific Service
```powershell
docker-compose -f docker-compose-fixed.yml up -d --build [service-name]
```

### Access Container Shell
```powershell
docker exec -it phone-accessories-[service-name] sh
```

## 🔐 Security Features

- JWT-based authentication for all protected endpoints
- Role-based access control (admin vs client)
- Centralized authentication via API Gateway
- Secure password hashing with bcrypt
- CORS protection

## 📁 Project Structure
```
/
├── admin-dashboard/   # Angular admin interface
├── auth-service/      # Authentication microservice
├── front/            # Next.js customer frontend
├── order-service/    # Order management service
├── product-service/  # Product catalog service
├── nginx/            # API Gateway configuration
└── docker-compose.yml # Main compose file
```

## 🐛 Troubleshooting

1. Run the troubleshooting script:
```powershell
./troubleshoot.ps1
```

2. Check service logs in the `./logs/` directory

3. Verify container status:
```powershell
docker-compose ps
```

4. Common issues:
   - If services can't connect, ensure all containers are on the same network
   - For database connection issues, check environment variables
   - For API Gateway issues, verify nginx configuration

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details

