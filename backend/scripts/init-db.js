#!/usr/bin/env node

/**
 * Database Initialization Script
 * 
 * This script initializes the MongoDB database with:
 * - Required indexes
 * - Default admin user
 * - Sample data (optional)
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../src/models/User');
const Product = require('../src/models/Product');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('📦 Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

const createIndexes = async () => {
  try {
    console.log('🔍 Creating database indexes...');
    
    // User indexes
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ isActive: 1 });
    
    // Product indexes
    await Product.collection.createIndex({ sku: 1 }, { unique: true });
    await Product.collection.createIndex({ name: 1 });
    await Product.collection.createIndex({ type: 1 });
    await Product.collection.createIndex({ isActive: 1 });
    await Product.collection.createIndex({ quantity: 1 });
    await Product.collection.createIndex({ price: 1 });
    await Product.collection.createIndex({ createdAt: -1 });
    
    // Compound indexes
    await Product.collection.createIndex({ name: 'text', description: 'text' });
    await Product.collection.createIndex({ type: 1, isActive: 1 });
    await Product.collection.createIndex({ quantity: 1, isActive: 1 });
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    console.log('👤 Checking for default admin user...');
    
    const existingAdmin = await User.findOne({ username: 'admin', role: 'admin' });
    
    if (existingAdmin) {
      console.log('ℹ️  Default admin user already exists');
      return existingAdmin;
    }
    
    const adminUser = new User({
      username: 'admin',
      password: 'admin123', // This will be hashed automatically
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('✅ Default admin user created');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   ⚠️  Please change the default password in production!');
    
    return adminUser;
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
    throw error;
  }
};

const checkDatabaseHealth = async () => {
  try {
    console.log('🏥 Performing database health check...');
    
    // Check collections exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('📋 Available collections:', collectionNames);
    
    // Check user count
    const userCount = await User.countDocuments();
    console.log(`👥 Total users: ${userCount}`);
    
    // Check product count
    const productCount = await Product.countDocuments();
    console.log(`📦 Total products: ${productCount}`);
    
    // Check admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    console.log(`🔐 Admin user exists: ${adminExists ? 'Yes' : 'No'}`);
    
    console.log('✅ Database health check completed');
  } catch (error) {
    console.error('❌ Database health check failed:', error.message);
    throw error;
  }
};

const initializeDatabase = async () => {
  console.log('🚀 Starting database initialization...\n');
  
  try {
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
      process.exit(1);
    }
    
    // Create indexes
    await createIndexes();
    
    // Create default admin user
    await createDefaultAdmin();
    
    // Perform health check
    await checkDatabaseHealth();
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Visit API docs: http://localhost:5000/api-docs');
    console.log('3. Login with admin credentials to test the API');
    console.log('4. (Optional) Run seeder to add sample data: npm run seed');
    
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n📦 Database connection closed');
  }
};

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = {
  initializeDatabase,
  createIndexes,
  createDefaultAdmin,
  checkDatabaseHealth
};
