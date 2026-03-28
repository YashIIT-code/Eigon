const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
});

const PLANS = {
  free: { name: 'Free', price: 0, videosPerMonth: 3, maxDuration: 30 },
  starter: { name: 'Starter', price: 19, priceId: process.env.STRIPE_PRICE_STARTER, videosPerMonth: 15, maxDuration: 120 },
  pro: { name: 'Pro', price: 49, priceId: process.env.STRIPE_PRICE_PRO, videosPerMonth: 50, maxDuration: 300 },
  enterprise: { name: 'Enterprise', price: 149, priceId: process.env.STRIPE_PRICE_ENTERPRISE, videosPerMonth: -1, maxDuration: 600 },
};

module.exports = { stripe, PLANS };
