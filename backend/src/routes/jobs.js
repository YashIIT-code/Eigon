const express = require('express');
const { createJob, getJobs, getJob, deleteJob } = require('../controllers/jobController');
const { authenticate } = require('../middleware/auth');
const { planBasedLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(authenticate);
router.post('/', planBasedLimiter, createJob);
router.get('/', getJobs);
router.get('/:id', getJob);
router.delete('/:id', deleteJob);

module.exports = router;
