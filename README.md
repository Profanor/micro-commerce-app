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
| **Admin Dashboard** | [https://kenkeputa-admin.vercel.app](https://kenkeputa-admin.vercel.app) | Vite + React admin interface |
| **Database** | PostgreSQL (Render) | Used by both backend and admin |
| **Mobile App** | Run locally with Expo | Customer shopping app |

---

## 🧠 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Backend** | NestJS, Prisma ORM, PostgreSQL |
| **Frontend (Admin)** | React + Vite |
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

## 🚀 Quick Start

### 🧱 Backend (Server)
```bash
cd server
pnpm install
pnpm start:dev
```

- .env Example:

DATABASE_URL="postgresql://<user>:<password>@<host>/<db_name>?schema=public"
PORT=4001
JWT_SECRET=dregon101.
JWT_EXPIRY=3600s

### 💻 Admin (Web App)
```bash
cd client/admin
pnpm install
pnpm run dev
```

- .env Example:
VITE_API_URL=https://micro-commerce-app.onrender.com/api/v1

### 📱 Mobile (Expo App)
```bash
cd client/mobile
pnpm install
npx expo start
```

- API Config (axiosClient.ts)
baseURL: "https://micro-commerce-app.onrender.com/api/v1"


### 🔐 Demo Credentials
Role	Email	               Password
Admin	admin@shop.com         admin123
	
User	user@shop.com          user123
	

📦 Features

✅ JWT Authentication
✅ Product CRUD (Admin)
✅ Order Placement & Revenue Analytics
✅ Cart Management (Mobile)
✅ PostgreSQL + Prisma Schema
✅ Swagger API Docs
✅ Docker-friendly structure
✅ CORS + Deployment Configured for Vercel & Render
✅ Modular, Service-Oriented Backend

## 👨‍💻 Author

- David Arinze
- Backend Engineer • Fullstack Enthusiast
- Built for assessment — but structured for production 😎


🧭 Sub-Docs

- Server README →

- Admin README →

- Mobile README →