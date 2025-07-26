const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const totalUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin', isActive: true });
    const regularUsers = await User.countDocuments({ role: 'user', isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
      isActive: true
    });

    // Product statistics
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.findLowStock();
    const outOfStockProducts = await Product.findOutOfStock();
    const newProductsThisMonth = await Product.countDocuments({
      createdAt: { $gte: startOfMonth },
      isActive: true
    });

    // Inventory value
    const inventoryValue = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalValue: { $sum: { $multiply: ['$quantity', '$price'] } } } }
    ]);

    // Top products by value
    const topProductsByValue = await Product.aggregate([
      { $match: { isActive: true } },
      { $addFields: { totalValue: { $multiply: ['$quantity', '$price'] } } },
      { $sort: { totalValue: -1 } },
      { $limit: 5 },
      { $project: { name: 1, sku: 1, quantity: 1, price: 1, totalValue: 1 } }
    ]);

    // Products by category
    const productsByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { 
        _id: '$type', 
        count: { $sum: 1 },
        totalValue: { $sum: { $multiply: ['$quantity', '$price'] } },
        avgPrice: { $avg: '$price' }
      } },
      { $sort: { count: -1 } }
    ]);

    // Recent activity (last 10 products created)
    const recentProducts = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name sku createdAt')
      .populate('createdBy', 'username');

    // Stock alerts
    const stockAlerts = {
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
      criticalItems: lowStockProducts.slice(0, 5).map(product => ({
        id: product._id,
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        threshold: product.lowStockThreshold
      }))
    };

    res.status(200).json({
      success: true,
      data: {
        summary: {
          users: {
            total: totalUsers,
            admins: adminUsers,
            regular: regularUsers,
            newThisMonth: newUsersThisMonth
          },
          products: {
            total: totalProducts,
            lowStock: lowStockProducts.length,
            outOfStock: outOfStockProducts.length,
            newThisMonth: newProductsThisMonth
          },
          inventory: {
            totalValue: inventoryValue[0]?.totalValue || 0,
            averageProductValue: totalProducts > 0 ? (inventoryValue[0]?.totalValue || 0) / totalProducts : 0
          }
        },
        charts: {
          topProductsByValue,
          productsByCategory
        },
        recentActivity: recentProducts,
        stockAlerts
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
};

const getSystemStats = async (req, res) => {
  try {
    // Database statistics
    const dbStats = await mongoose.connection.db.stats();
    
    // Collection statistics
    const userStats = await User.collection.stats();
    const productStats = await Product.collection.stats();

    // Index usage statistics
    const userIndexStats = await User.collection.indexStats();
    const productIndexStats = await Product.collection.indexStats();

    res.status(200).json({
      success: true,
      data: {
        database: {
          name: mongoose.connection.name,
          collections: dbStats.collections,
          dataSize: dbStats.dataSize,
          storageSize: dbStats.storageSize,
          indexes: dbStats.indexes,
          indexSize: dbStats.indexSize
        },
        collections: {
          users: {
            count: userStats.count,
            size: userStats.size,
            avgObjSize: userStats.avgObjSize
          },
          products: {
            count: productStats.count,
            size: productStats.size,
            avgObjSize: productStats.avgObjSize
          }
        },
        performance: {
          userIndexes: userIndexStats.length,
          productIndexes: productIndexStats.length
        }
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching system statistics'
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};
    
    if (search) {
      query.username = { $regex: search, $options: 'i' };
    }
    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalUsers: total,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
          limit: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

/**
 * @desc    Update user status (Admin only)
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin)
 */
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    // Prevent admin from deactivating themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify your own account status'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
};

module.exports = {
  getDashboard,
  getSystemStats,
  getAllUsers,
  updateUserStatus
};
