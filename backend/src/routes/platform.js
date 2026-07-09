const express = require('express');
const router = express.Router();
const { getPlatformStats } = require('../controllers/platformController');

router.get('/stats', getPlatformStats);

module.exports = router;