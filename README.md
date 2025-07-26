
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

![register](https://github.com/user-attachments/assets/f3e8b800-a327-49ba-88d0-85b5354f2212)

---

### 🔐 Login `/login`
Generates a JWT token upon successful authentication.

![login](https://github.com/user-attachments/assets/721462fe-b5fd-4ffd-95d0-3c7d0594f5aa)

---

### 📤 Add Product `/products`  
Requires authentication. Adds a new product to inventory.

![add_product](https://github.com/user-attachments/assets/8fbcc88d-e725-43f6-9107-b8c67490ffa2)

---

### 🔁 Update Quantity `/products/{id}/quantity`
Modifies the quantity of an existing product.

![quantity](https://github.com/user-attachments/assets/bb48f174-a3ae-4b5f-a31a-056b6d5c6573)

---

### 📥 Get All Products `/products`
Fetches the list of all products in inventory.

![get_product](https://github.com/user-attachments/assets/d6f5ea5c-c997-4f1d-bd86-7b0976975b61)

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
