const express = require('express');
const {
  getDashboard,
  getSystemStats,
  getAllUsers,
  updateUserStatus
} = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const Joi = require('joi');

const router = express.Router();

const updateUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required()
});

router.get('/dashboard', adminAuth, getDashboard);
router.get('/stats', adminAuth, getSystemStats);
router.get('/users', adminAuth, getAllUsers);
router.put('/users/:id/status', adminAuth, validate(updateUserStatusSchema), updateUserStatus);

module.exports = router;
