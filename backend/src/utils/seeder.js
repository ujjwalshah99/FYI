const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📦 MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });

    // Create regular user
    const regularUser = new User({
      username: 'user',
      password: 'user123',
      role: 'user'
    });

    await adminUser.save();
    await regularUser.save();

    console.log('✅ Users seeded successfully');
    console.log('Admin credentials: admin / admin123');
    console.log('User credentials: user / user123');

    return { adminUser, regularUser };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

const seedProducts = async (adminUserId) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    const sampleProducts = [
      {
        name: 'Wireless Bluetooth Headphones',
        type: 'Electronics',
        sku: 'WBH-001',
        image_url: 'https://example.com/headphones.jpg',
        description: 'High-quality wireless headphones with noise cancellation',
        quantity: 50,
        price: 99.99,
        createdBy: adminUserId
      },
      {
        name: 'Gaming Mechanical Keyboard',
        type: 'Electronics',
        sku: 'GMK-002',
        image_url: 'https://example.com/keyboard.jpg',
        description: 'RGB mechanical keyboard perfect for gaming',
        quantity: 25,
        price: 149.99,
        createdBy: adminUserId
      },
      {
        name: 'Ergonomic Office Chair',
        type: 'Furniture',
        sku: 'EOC-003',
        image_url: 'https://example.com/chair.jpg',
        description: 'Comfortable ergonomic chair for long work sessions',
        quantity: 15,
        price: 299.99,
        createdBy: adminUserId
      },
      {
        name: 'Stainless Steel Water Bottle',
        type: 'Accessories',
        sku: 'SSWB-004',
        image_url: 'https://example.com/bottle.jpg',
        description: 'Insulated water bottle that keeps drinks cold for 24 hours',
        quantity: 100,
        price: 24.99,
        createdBy: adminUserId
      },
      {
        name: 'Laptop Stand Adjustable',
        type: 'Electronics',
        sku: 'LSA-005',
        image_url: 'https://example.com/laptop-stand.jpg',
        description: 'Adjustable aluminum laptop stand for better ergonomics',
        quantity: 30,
        price: 49.99,
        createdBy: adminUserId
      },
      {
        name: 'Wireless Mouse',
        type: 'Electronics',
        sku: 'WM-006',
        image_url: 'https://example.com/mouse.jpg',
        description: 'Precision wireless mouse with long battery life',
        quantity: 75,
        price: 29.99,
        createdBy: adminUserId
      },
      {
        name: 'Desk Organizer',
        type: 'Office Supplies',
        sku: 'DO-007',
        image_url: 'https://example.com/organizer.jpg',
        description: 'Bamboo desk organizer with multiple compartments',
        quantity: 40,
        price: 34.99,
        createdBy: adminUserId
      },
      {
        name: 'USB-C Hub',
        type: 'Electronics',
        sku: 'UCH-008',
        image_url: 'https://example.com/usb-hub.jpg',
        description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card slots',
        quantity: 20,
        price: 79.99,
        createdBy: adminUserId
      },
      {
        name: 'Blue Light Glasses',
        type: 'Accessories',
        sku: 'BLG-009',
        image_url: 'https://example.com/glasses.jpg',
        description: 'Computer glasses that filter blue light',
        quantity: 60,
        price: 19.99,
        createdBy: adminUserId
      },
      {
        name: 'Portable Phone Charger',
        type: 'Electronics',
        sku: 'PPC-010',
        image_url: 'https://example.com/charger.jpg',
        description: '10000mAh portable battery pack with fast charging',
        quantity: 5, // Low stock item
        price: 39.99,
        createdBy: adminUserId
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('✅ Products seeded successfully');
    console.log(`📊 Created ${sampleProducts.length} sample products`);
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    const { adminUser } = await seedUsers();
    await seedProducts(adminUser._id);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Admin user created (admin/admin123)');
    console.log('- Regular user created (user/user123)');
    console.log('- 10 sample products created');
    console.log('- 1 low stock product for testing');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
    process.exit(0);
  }
};

const clearDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🧹 Clearing database...');
    
    await User.deleteMany({});
    await Product.deleteMany({});
    
    console.log('✅ Database cleared successfully!');
    
  } catch (error) {
    console.error('❌ Clearing failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
    process.exit(0);
  }
};

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'seed':
    seedDatabase();
    break;
  case 'clear':
    clearDatabase();
    break;
  default:
    console.log('Usage: node seeder.js [seed|clear]');
    console.log('  seed  - Populate database with sample data');
    console.log('  clear - Clear all data from database');
    process.exit(1);
}
