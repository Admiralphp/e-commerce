# 📱 Phone Accessories E-Commerce Platform – Microservices Architecture

This project is a full-featured, scalable e-commerce platform specialized in selling phone accessories (cases, chargers, earphones, etc.). It is designed with a **microservices architecture** and adheres to modern development and DevOps best practices.

---

## 🧩 Architecture Overview

Each microservice is containerized and communicates via an **Nginx API Gateway**. Authentication is centralized and based on **JWT tokens**.

### 🖼️ Frontend – Customer Web UI
- **Tech**: Next.js
- **Features**:
  - Browse product catalog
  - Register / Login
  - Manage shopping cart
  - Simulate checkout process

### 🔐 Authentication Service
- **Tech**: Node.js + Express + MongoDB
- **Features**:
  - User registration & login (JWT)
  - Password hashing with bcrypt
  - Role-based access control (admin/client)
  - User management (admin-only)

### 📦 Product Catalog Service
- **Tech**: Go (Fiber) + PostgreSQL (Neon)
- **Features**:
  - Public API for browsing, searching, filtering products
  - Admin CRUD (Create, Read, Update, Delete)
- **Security**:
  - JWT-protected routes for admin operations
  - Public routes for read-only access

### 🛒 Order & Cart Service
- **Tech**: Node.js + MongoDB
- **Features**:
  - Add to cart, view cart
  - Place order, view order history
  - Admin endpoints to view, fulfill, or delete orders
- **Security**:
  - JWT required for all endpoints
  - Admin routes protected by role check

### 🖥️ Admin Dashboard
- **Tech**: Angular 17+
- **Features**:
  - Secure login form (JWT)
  - Product management (via Product API)
  - Order management (via Order API)
- **Tech stack**:
  - Angular Router
  - Angular Forms (Reactive)
  - HttpClient with JWT Interceptor

---

## 🔐 Global Security

- All protected APIs require a valid JWT (passed via HTTP Authorization headers).
- API Gateway (Nginx) routes and validates tokens centrally.
- Middleware ensures role-based access (`admin` vs `client`).

---

## 🛠 Tech Stack Summary

| Component        | Tech Stack                          |
|------------------|--------------------------------------|
| Frontend         | Next.js                             |
| Admin Dashboard  | Angular 17+                          |
| Auth Service     | Node.js + Express + MongoDB         |
| Product Service  | Go + Fiber + PostgreSQL (Neon)      |
| Order Service    | Node.js + MongoDB                   |
| API Gateway      | Nginx                               |
| Security         | JWT + bcrypt                        |
| Deployment       | Docker + Docker Compose + Vercel    |
| CI/CD            | GitHub Actions                      |
| Server           | Ubuntu Server 24.04 (self-hosted)   |

---

## 📁 Microservice Structure (Typical)

/service-name
├── models/
├── controllers/
├── routes/
├── middleware/ # JWT, validation, RBAC
├── config/ # DB, env
├── app.js / main.go # Entry point
├── Dockerfile
└── docker-compose.yml (optional for dev)

## 🚀 Deployment & DevOps

- Each service runs in its own container
- Local orchestration via `docker-compose`
- Frontend deployed to **Vercel**
- Production backend hosted on **Ubuntu Server 24.04**
- CI/CD pipelines defined in **GitHub Actions**

---

## ✅ Development Notes

You can use GitHub Copilot or any AI assistant to:
- Scaffold new Angular components or services
- Secure backend routes with JWT & role checks
- Generate Dockerfiles and deployment configs
- Extend APIs using consistent RESTful structure
- Improve cross-service communication logic

