# 🛒 OmniMart — Modern Full-Stack E-Commerce Platform

[![React](https://img.shields.io/badge/Frontend-React_19_+_TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build_Tool-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.4-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Language-Java_17%2F21-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A high-performance, responsive full-stack e-commerce web application featuring a modern React frontend with Tailwind CSS and an enterprise-grade Java Spring Boot RESTful API backend.

---

## 🌟 Key Features

### 🛍️ Client / Customer Experience
- **Dynamic Product Catalog**: Search, filter by categories, brands, price brackets, and real-time sorting.
- **Interactive Cart & Drawer**: Persistent cart state, live quantity modification, subtotal & tax estimation.
- **Seamless Checkout**: Multi-step checkout with address validation, payment method selection, and order confirmation.
- **Product Details View**: High-resolution image zoom, stock indicators, reviews, ratings, and related item recommendations.
- **Wishlist & Compare**: Save favorite products across sessions.

### ⚙️ Backend & API Capabilities
- **RESTful Endpoints**: Built following REST architecture best practices with DTO patterns.
- **Data Persistence**: Spring Data JPA with entity relationships (Products, Categories, Orders, OrderItems).
- **In-Memory & Production Ready**: Pre-configured with H2 Database for instant plug-and-play development; easily connects to PostgreSQL or MySQL.
- **CORS Configured**: Seamless local and cloud cross-origin resource sharing between frontend and backend.

---

## 🏗️ Architecture & Project Structure

```text
omnimart/
├── frontend/                     # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Reusable UI components (Navbar, Cart, ProductCard)
│   │   ├── context/              # Cart & App state management
│   │   ├── pages/                # Catalog, ProductDetails, Checkout, OrderSuccess
│   │   ├── types/                # TypeScript models & API contracts
│   │   └── App.tsx               # Root routing and layout
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Java Spring Boot 3 Backend
│   ├── src/main/java/com/omnimart/
│   │   ├── controller/           # ProductController, OrderController, CategoryController
│   │   ├── model/                # Product, Category, Order, OrderItem JPA Entities
│   │   ├── repository/           # Spring Data JPA Repositories
│   │   ├── service/              # Business logic services
│   │   └── OmnimartApplication.java
│   ├── src/main/resources/
│   │   └── application.properties# Server, port, and H2 database configuration
│   ├── build.gradle
│   └── gradlew / gradlew.bat
│
└── OmniMart-Project-Report.html  # Comprehensive project report & architecture document
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or later) & `npm`
- **Java Development Kit (JDK)** 17 or 21
- **Git**

---

### 1. Backend Setup (Spring Boot)

```bash
cd backend

# On Windows:
./gradlew.bat bootRun

# On Linux / macOS:
./gradlew bootRun
```

The Spring Boot backend will start on `http://localhost:8080`.
- **API Base URL**: `http://localhost:8080/api`
- **H2 Database Console**: `http://localhost:8080/h2-console`

---

### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve all products (supports query params for category, search, sort) |
| `GET` | `/api/products/{id}` | Get specific product details by ID |
| `POST` | `/api/products` | Create a new product (Admin) |
| `GET` | `/api/categories` | List all product categories |
| `POST` | `/api/orders` | Place a new customer order |
| `GET` | `/api/orders/{id}` | Retrieve order status & summary |

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
