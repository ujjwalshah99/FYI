
# 🧾 Inventory Management Tool (Backend APIs)

A simple backend API application to manage products and stock for a small business using **Node.js**, **Express**, and **MongoDB**. Includes user authentication and CRUD operations on inventory.

---

## 🚀 Features

- 🔐 User Authentication (JWT-based)
- ➕ Add new products
- 🔄 Update product quantity
- 📦 Fetch list of all products

---

## 🧪 API Demonstration (Postman)

### ✅ User Registration `/register`
Registers a new user with a username and password.

![register](https://github.com/user-attachments/assets/dbaad06e-cda2-4edb-b1a1-911206088b28)

---

### 🔐 Login `/login`
Generates a JWT token upon successful authentication.

![login](https://github.com/user-attachments/assets/7d9f6d89-60d5-4f1b-9d89-828dc9b0233f)

---

### 📤 Add Product `/products`  
Requires authentication. Adds a new product to inventory.

![add_product](https://github.com/user-attachments/assets/fd0c2012-e950-4e1c-9f84-911b11d584e2)

---

### 🔁 Update Quantity `/products/{id}/quantity`
Modifies the quantity of an existing product.

![quantity](https://github.com/user-attachments/assets/56392ae3-ddcb-43f1-b018-7450d646fb85)

---

### 📥 Get All Products `/products`
Fetches the list of all products in inventory.

![get_product](https://github.com/user-attachments/assets/35101a54-decc-4eb8-9b31-e6e15c98f8b2)

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB with Mongoose  
- **Auth**: JWT (JSON Web Tokens)  
- **Tools**: Postman, Swagger (for API docs)

---

## 📁 Folder Structure

```
├── models/          # Mongoose schemas
├── routes/          # Route handlers
├── controllers/     # Business logic
├── middleware/      # Auth middleware
├── config/          # DB connection, env config
├── server.js           # Entry point
```

---

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd inventory-management-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add `.env` file:
   ```
   PORT=8082
   MONGODB_URI=mongodb://localhost:27017/inventory
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Test with Postman using the included collection or interact via Swagger.

---

## 📄 API Documentation

- Swagger UI available at: `http://localhost:8082/api-docs` (if enabled)  
- Alternatively, refer to the included Postman collection (`inventory-collection.json`)

---

## 📦 Database Initialization

Make sure MongoDB is running locally or update the URI accordingly. No manual table creation is needed—collections auto-generate on insert.
