# 🛍️ Micro-Commerce App

A full-stack micro-commerce system built with **NestJS**, **PostgreSQL**, **React (Vite)**, and **React Native (Expo)**.  
The project includes:
- A secure RESTful API with JWT authentication  
- A web-based Admin Dashboard  
- A mobile app for customers  

---

## 🌍 Live URLs

| Service | URL | Description |
|----------|-----|-------------|
| **Backend (API)** | [https://micro-commerce-app.onrender.com](https://micro-commerce-app.onrender.com) | Hosted on Render |
| **Swagger Docs** | [https://micro-commerce-app.onrender.com/api/docs](https://micro-commerce-app.onrender.com/api/docs) | API documentation |
| **Admin Dashboard** | [https://micro-commerce-app-nine.vercel.app](https://micro-commerce-app-nine.vercel.app) | Vite + React admin interface |
| **Database** | PostgreSQL (Render) | Used by both backend and admin |
| **Mobile App** | Run locally with Expo | Customer shopping app |

---

## 🧠 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Backend** | NestJS, Prisma ORM, PostgreSQL |
| **Frontend (Admin)** | React + Vite +  Tailwind|
| **Mobile App** | React Native (Expo) |
| **Deployment** | Render (Backend + DB), Vercel (Admin) |
| **Authentication** | JWT-based |
| **Other Tools** | pnpm, Axios, SecureStore, AsyncStorage |

---

## ⚙️ Directory Structure

micro-commerce-app/
│
├── server/ # NestJS backend
│ ├── src/
│ ├── prisma/
│ ├── README.md # API setup + environment variables
│
├── client/
│ ├── admin/ # React-Vite admin dashboard
│ │ ├── src/
│ │ └── README.md # Vite build + env setup
│ └── mobile/ # Expo React Native app
│ └── README.md # Local mobile usage
│
└── README.md # (this file)


---

## Note: See .env.example for all required keys.

## 🚀 Quick Start

### 🧱 Backend (Server)
```bash
cd server
pnpm install
pnpm start:dev
```


### 💻 Admin (Web App)
```bash
cd client/admin
pnpm install
pnpm run dev
```


### 📱 Mobile (Expo App)
```bash
cd client/mobile
pnpm install
npx expo start
```


## 🌱 Seed instructions
### 🌱 Database Seeding

- To populate your local or hosted PostgreSQL database with sample users, admin and products:

```bash
cd server
pnpm run seed
```


### 🔐 Demo Credentials
| Role      | Email          | Password
|-----------|----------------|--------------------|
| **User**  | user@shop.com  | user123
| **Admin** | admin@shop.com | admin123

- These are seeded demo accounts for testing authentication and admin access. Passwords are public for demo purposes only.


## 📡 API Endpoints Overview

### Auth Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive a JWT token |

**Example:**
```json
POST /api/v1/auth/login
{
  "email": "dave12@gmail.com",
  "password": "yourpassword"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "email": "dave12@gmail.com",
    "role": "USER"
  }
}
```



### Product Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/v1/products` | Get all products |
| GET | `/api/v1/products/:id` | Get single product |
| POST | `/api/v1/products` | Create new product (Admin only) |
| PATCH | `/api/v1/products/:id` | Update product (Admin only) |
| DELETE | `/api/v1/products/:id` | Soft delete a product |



### Order Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/v1/orders` | Create a new order |
| GET | `/api/v1/orders/my` | Fetch user’s orders |
| GET | `/api/v1/orders/all` | Admin – fetch all orders |
| GET | `/api/v1/orders/revenue` | Get total revenue |


Swagger docs available at:
🔗 https://micro-commerce-app.onrender.com/api/docs


**Testing**
🧰 End-to-End (E2E) Tests

- All backend tests are written using Jest and Supertest, covering authentication, product CRUD, and key validation flows.
- These tests ensure that the API endpoints, database interactions, and middleware (like guards and validation pipes) work together as expected.
- The test configuration is defined in test/jest-e2e.json, and tests are located inside the server/test directory.


🧱 Run End-to-End (E2E) Tests
```bash
cd server
pnpm run test:e2e
```

✅ Coverage

- User registration and login (validations + JWT)

- Product creation, retrieval, update, and deletion

- Proper error handling for invalid or unauthorized actions

- Database seed verification through API responses

----

📦 **Features**

- ✅ JWT Authentication
- ✅ Product CRUD (Admin)
- ✅ Order Placement & Revenue Analytics
- ✅ Cart Management (Mobile)
- ✅ PostgreSQL + Prisma Schema
- ✅ Swagger API Docs
- ✅ Docker-friendly structure
- ✅ CORS + Deployment Configured for Vercel & Render
- ✅ Modular, Service-Oriented Backend

## 👨‍💻 Author

- David Arinze
- Backend Engineer • Fullstack Enthusiast
- Built for assessment — but structured for production 😎


🧭 Sub-Docs

- Server README →

- Admin README →

- Mobile README →