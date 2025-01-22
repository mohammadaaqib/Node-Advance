const express = require('express');
const authController = require('../controllers/auth-controller');

const router = express.Router();

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
//router.post('/logout', authController.logout);

// Protected route example
//router.get('/profile', authController.protect, authController.getProfile);

module.exports = router;