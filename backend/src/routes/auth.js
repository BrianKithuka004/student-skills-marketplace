const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// ========== PUBLIC ROUTES ==========
router.post('/register', authController.register);
router.post('/login', authController.login);

// ========== PROTECTED ROUTES (Require Token) ==========
router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, authController.updateUser);
router.get('/users', authenticate, authController.getAllUsers);

module.exports = router;