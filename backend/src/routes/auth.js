const express = require('express');
const { login, getProfile, register, verifyToken } = require('../controllers/authController');
const { auth, adminAuth } = require('../middleware/auth');
const { validate, loginSchema } = require('../middleware/validation');

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.get('/profile', auth, getProfile);
router.post('/register', adminAuth, validate(loginSchema), register);
router.get('/verify', auth, verifyToken);

module.exports = router;
