const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');

router.use(authenticate);

router.post('/', applyToJob);
router.get('/my', getMyApplications);
router.get('/job/:jobId', getJobApplications);
router.put('/:id', updateApplicationStatus);

module.exports = router;