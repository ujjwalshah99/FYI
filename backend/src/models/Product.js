const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [1, 'Product name cannot be empty'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Product type is required'],
    trim: true,
    minlength: [1, 'Product type cannot be empty'],
    maxlength: [50, 'Product type cannot exceed 50 characters']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
    minlength: [1, 'SKU cannot be empty'],
    maxlength: [50, 'SKU cannot exceed 50 characters'],
    match: [/^[A-Z0-9-_]+$/, 'SKU can only contain uppercase letters, numbers, hyphens, and underscores']
  },
  image_url: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty string
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

productSchema.index({ sku: 1 });
productSchema.index({ name: 1 });
productSchema.index({ type: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ quantity: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

productSchema.index({ name: 'text', description: 'text' }); // For text search
productSchema.index({ type: 1, isActive: 1 });
productSchema.index({ quantity: 1, isActive: 1 });

productSchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.lowStockThreshold;
});

productSchema.virtual('stockStatus').get(function() {
  if (this.quantity === 0) return 'out_of_stock';
  if (this.quantity <= this.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

productSchema.methods.updateQuantity = function(newQuantity, updatedBy) {
  this.quantity = newQuantity;
  this.updatedBy = updatedBy;
  return this.save();
};

productSchema.statics.findLowStock = function() {
  return this.find({
    $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
    isActive: true
  });
};

productSchema.statics.findOutOfStock = function() {
  return this.find({ quantity: 0, isActive: true });
};

productSchema.statics.searchProducts = function(searchTerm, filters = {}) {
  const query = { isActive: true };
  
  if (searchTerm) {
    query.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { sku: { $regex: searchTerm, $options: 'i' } }
    ];
  }
  
  if (filters.type) {
    query.type = { $regex: filters.type, $options: 'i' };
  }
  
  if (filters.minPrice !== undefined) {
    query.price = { ...query.price, $gte: filters.minPrice };
  }
  
  if (filters.maxPrice !== undefined) {
    query.price = { ...query.price, $lte: filters.maxPrice };
  }
  
  if (filters.minQuantity !== undefined) {
    query.quantity = { ...query.quantity, $gte: filters.minQuantity };
  }
  
  if (filters.maxQuantity !== undefined) {
    query.quantity = { ...query.quantity, $lte: filters.maxQuantity };
  }
  
  return this.find(query);
};

productSchema.pre('save', function(next) {
  if (this.sku) {
    this.sku = this.sku.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
