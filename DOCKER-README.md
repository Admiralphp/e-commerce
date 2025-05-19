# Phone Accessories E-Commerce Platform

A containerized microservices e-commerce application for phone accessories. This application is composed of several microservices, each with its own responsibility, containerized with Docker.

## Architecture Overview

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

This project follows a microservices architecture pattern with the following components:

- **API Gateway (Nginx)** - Routes requests to appropriate services
- **Auth Service** - Handles user authentication and authorization
- **Product Service** - Manages product catalog and categories
- **Order Service** - Processes orders and shopping carts
- **Frontend** - Next.js client application for customers
- **Admin Dashboard** - Angular admin interface for managing the store
- **MongoDB** - Document database for Auth and Order services
- **PostgreSQL** - Relational database for Product service
- **Monitoring Tools** - MongoDB Express and pgAdmin for database administration## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- PowerShell
- Administrator privileges (for hosts file modification)

## Getting Started

1. **Clone the repository:**

   ```
   git clone <repository-url>
   cd e-commerce/PIC
   ```

2. **Start all services:**

   ```powershell
   ./start-all-services.ps1
   ```

   This script will:
   - Create required log directories
   - Add necessary host entries (requires admin privileges)
   - Start all containers in the correct order
   - Configure network settings

3. **Check service health:**

   ```powershell
   ./health-check.ps1
   ```

   This will show the status of all services and verify API endpoints.

4. **Access the applications:**

   - Frontend (Customer): http://localhost:3001
   - Admin Dashboard: http://localhost:4200
   - API Gateway: http://api.phoneaccessories.local
   - MongoDB Express: http://localhost:8081
   - pgAdmin: http://localhost:5050 (Email: admin@example.com, Password: admin)

## Troubleshooting

If you encounter issues with the services:

1. **Run the troubleshooting script:**

   ```powershell
   ./troubleshoot.ps1
   ```

   This script automatically detects and fixes common issues with:
   - Nginx configuration
   - Product service container
   - Database connections
   - Network configuration
   - Volume permissions

2. **Check logs:**

   Service logs are available in the `./logs/` directory, organized by service.

3. **Manual container logs:**

   ```powershell
   docker logs phone-accessories-auth
   docker logs phone-accessories-products
   docker logs phone-accessories-orders
   docker logs phone-accessories-gateway
   ```

## Stopping Services

To stop all running services:

```powershell
./stop-all-services.ps1
```

To remove all containers and volumes:

```powershell
docker-compose -f docker-compose-final.yml down -v
```

## Service URLs and Ports

| Service | Internal URL | External URL |
|---------|--------------|-------------|
| API Gateway | http://nginx:80 | http://api.phoneaccessories.local |
| Auth Service | http://auth-service:3000 | http://localhost:3000 |
| Product Service | http://product-service:8080 | http://localhost:8080 |
| Order Service | http://order-service:3002 | http://localhost:3002 |
| Frontend | http://frontend:3000 | http://localhost:3001 |
| Admin Dashboard | http://admin-dashboard:4200 | http://localhost:4200 |
| MongoDB | mongodb://mongo:27017 | mongodb://localhost:27017 |
| MongoDB Express | http://mongo-express:8081 | http://localhost:8081 |
| PostgreSQL | postgres://postgres:5432 | postgres://localhost:5432 |
| pgAdmin | http://pgadmin:80 | http://localhost:5050 |

## Development and Maintenance

### Rebuilding a specific service

To rebuild and restart a specific service:

```powershell
docker-compose -f docker-compose-final.yml up -d --build <service-name>
```

Replace `<service-name>` with one of: `nginx`, `auth-service`, `product-service`, `order-service`, `frontend`, or `admin-dashboard`.

### Accessing Container Shells

For debugging purposes, you can access a shell inside a container:

```powershell
docker exec -it phone-accessories-auth sh
docker exec -it phone-accessories-products sh
docker exec -it phone-accessories-orders sh
```

### Database Administration

- MongoDB Express: http://localhost:8081
  - Username: root
  - Password: rootpassword

- pgAdmin: http://localhost:5050
  - Email: admin@example.com
  - Password: admin
  - PostgreSQL connection:
    - Host: postgres
    - Port: 5432
    - Username: postgres
    - Password: postgres
   docker logs phone-accessories-gateway
   ```

## Notes Importantes

- Tous les services partagent le même secret JWT pour l'authentification
- Les données sont persistantes via des volumes Docker
- Les logs sont disponibles dans le répertoire `./logs`
- Pour un environnement de production, activez HTTPS et revoyez les paramètres de sécurité
