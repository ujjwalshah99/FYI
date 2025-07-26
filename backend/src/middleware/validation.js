const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Validation schemas
const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});

const productSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  type: Joi.string().min(1).max(50).required(),
  sku: Joi.string().min(1).max(50).required(),
  image_url: Joi.string().uri().optional().allow(''),
  description: Joi.string().max(500).optional().allow(''),
  quantity: Joi.number().integer().min(0).required(),
  price: Joi.number().min(0).required()
});

const updateQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(0).required()
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().optional(),
  type: Joi.string().optional(),
  sortBy: Joi.string().valid('name', 'price', 'quantity', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

module.exports = {
  validate,
  validateQuery,
  loginSchema,
  productSchema,
  updateQuantitySchema,
  paginationSchema
};
