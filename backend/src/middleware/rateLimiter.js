const rateLimit = require('express-rate-limit');

const PLAN_LIMITS = {
  free: { windowMs: 60 * 1000, max: 20 },
  starter: { windowMs: 60 * 1000, max: 60 },
  pro: { windowMs: 60 * 1000, max: 120 },
  enterprise: { windowMs: 60 * 1000, max: 300 },
};

const planBasedLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: (req) => {
    const plan = req.user?.plan || 'free';
    return PLAN_LIMITS[plan]?.max || 20;
  },
  message: { error: { message: 'Too many requests. Please upgrade your plan for higher limits.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: { message: 'Too many requests from this IP.' } },
});

module.exports = { planBasedLimiter, generalLimiter };
