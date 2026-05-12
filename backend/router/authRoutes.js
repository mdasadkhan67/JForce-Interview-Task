const express = require('express');
const authController = require('../controller/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Auth API'
  });
});

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', verifyToken, authController.getCurrentUser);
router.get('/all-users', verifyToken, authController.getAllUsers);

module.exports = router;
