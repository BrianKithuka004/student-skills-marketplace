const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
  getStats,
  getAllUsers,
  updateUser,
  deleteUser,
  deleteJob
} = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireRole(['ADMIN']));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.delete('/jobs/:id', deleteJob);

module.exports = router;