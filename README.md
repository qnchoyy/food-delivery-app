# 🍔 Food Delivery API

A RESTful API backend for a food delivery application built with Node.js, Express, and MongoDB.

---

## 🚧 Project Status

⚠️ **WORK IN PROGRESS** ⚠️  
This project is currently under development and **not yet ready for production use**. Some features might be incomplete or subject to change.

---

## ✨ Features

- 👤 **User Authentication and Authorization** (JWT)
- 🏷️ **Multiple User Roles** (customer, restaurant-owner, delivery-person, admin)
- 🏢 **Restaurant Management**
- 🍽️ **Menu and Menu Items Management**
- 📦 **Order Processing with Status Tracking**
- ✅ **Admin Approval Workflow** for restaurants and menus

---

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing

---

## 📚 API Endpoints

### 🔐 Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT token

### 🏢 Restaurants

- `GET /api/restaurants` — Get all approved and active restaurants
- `GET /api/restaurants/:id` — Get specific restaurant details
- `POST /api/restaurants` — Create a new restaurant (restaurant-owner only)
- `PUT /api/restaurants/:id` — Update restaurant (owner or admin only)
- `DELETE /api/restaurants/:id` — Delete restaurant (owner or admin only)
- `PUT /api/restaurants/:id/approve` — Approve restaurant (admin only)

### 📋 Menus

- `GET /api/menu/:restaurantId` — Get restaurant's menu
- `POST /api/menu/:restaurantId` — Create menu for restaurant (owner only)
- `POST /api/menu/:restaurantId/items` — Add item to menu (owner only)
- `PUT /api/menu/:restaurantId/approve` — Approve menu (admin only)

### 🍽️ Menu Items

- `GET /api/menu-items/:restaurantId/items` — Get all menu items for a restaurant
- `GET /api/menu-items/item/:id` — Get specific menu item
- `POST /api/menu-items/:restaurantId/item` — Create menu item (owner only)
- `PUT /api/menu-items/item/:id` — Update menu item (owner only)
- `DELETE /api/menu-items/item/:id` — Delete menu item (owner only)

### 📦 Orders

- `GET /api/orders/my-orders` — Get logged-in user's orders
- `GET /api/orders/restaurant/:restaurantId` — Get restaurant orders (owner or admin only)
- `GET /api/orders/:orderId` — Get specific order details
- `POST /api/orders` — Create a new order
- `PUT /api/orders/:orderId/status` — Update order status (owner, admin, or delivery-person)
- `PUT /api/orders/:orderId/cancel` — Cancel an order (customer only)
