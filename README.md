
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

![Register](WhatsApp_Image_2025-07-26_at_11.00.32_AM_(2)[1].jpeg)

---

### 🔐 Login `/login`
Generates a JWT token upon successful authentication.

![Login](WhatsApp_Image_2025-07-26_at_11.00.32_AM_(1)[1].jpeg)

---

### 📤 Add Product `/products`  
Requires authentication. Adds a new product to inventory.

![Add Product](WhatsApp_Image_2025-07-26_at_11.00.34_AM[1].jpeg)

---

### 🔁 Update Quantity `/products/{id}/quantity`
Modifies the quantity of an existing product.

![Update Quantity](WhatsApp_Image_2025-07-26_at_11.00.35_AM[1].jpeg)

---

### 📥 Get All Products `/products`
Fetches the list of all products in inventory.

![Get Products](WhatsApp_Image_2025-07-26_at_11.00.34_AM_(2)[1].jpeg)

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
├── app.js           # Entry point
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
