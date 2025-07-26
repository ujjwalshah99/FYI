// MongoDB initialization script for Docker
// This script runs when the MongoDB container starts for the first time

// Switch to the inventory_management database
db = db.getSiblingDB('inventory_management');

// Create a user for the application
db.createUser({
  user: 'inventory_user',
  pwd: 'inventory_password',
  roles: [
    {
      role: 'readWrite',
      db: 'inventory_management'
    }
  ]
});

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'password', 'role'],
      properties: {
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 30,
          description: 'Username must be a string between 3-30 characters'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'Password must be at least 6 characters'
        },
        role: {
          enum: ['user', 'admin'],
          description: 'Role must be either user or admin'
        },
        isActive: {
          bsonType: 'bool',
          description: 'isActive must be a boolean'
        }
      }
    }
  }
});

db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'type', 'sku', 'quantity', 'price', 'createdBy'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'Product name must be a string between 1-100 characters'
        },
        type: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 50,
          description: 'Product type must be a string between 1-50 characters'
        },
        sku: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 50,
          description: 'SKU must be a string between 1-50 characters'
        },
        quantity: {
          bsonType: 'int',
          minimum: 0,
          description: 'Quantity must be a non-negative integer'
        },
        price: {
          bsonType: 'number',
          minimum: 0,
          description: 'Price must be a non-negative number'
        },
        isActive: {
          bsonType: 'bool',
          description: 'isActive must be a boolean'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });

db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ name: 1 });
db.products.createIndex({ type: 1 });
db.products.createIndex({ isActive: 1 });
db.products.createIndex({ quantity: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ createdAt: -1 });

// Compound indexes
db.products.createIndex({ name: 'text', description: 'text' });
db.products.createIndex({ type: 1, isActive: 1 });
db.products.createIndex({ quantity: 1, isActive: 1 });

print('Database initialization completed successfully!');
print('Created collections: users, products');
print('Created indexes for optimal performance');
print('Created application user: inventory_user');
