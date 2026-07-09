const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createReview, getUserReviews } = require('../controllers/reviewController');

// Public route
router.get('/user/:userId', getUserReviews);

// Protected routes
router.post('/', authenticate, createReview);

module.exports = router;