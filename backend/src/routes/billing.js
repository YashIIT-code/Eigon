const express = require('express');
const { getPlans, createCheckoutSession, handleWebhook } = require('../controllers/billingController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/plans', getPlans);
router.post('/checkout', authenticate, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
