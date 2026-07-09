const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createJob, getJobs, getJobById, completeJob } = require('../controllers/jobController');

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', authenticate, createJob);
router.put('/:id/complete', authenticate, completeJob);

module.exports = router;