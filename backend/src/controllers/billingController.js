const { stripe, PLANS } = require('../config/stripe');
const { User, Subscription } = require('../models');

exports.getPlans = (req, res) => {
  res.json({ plans: PLANS });
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    const planConfig = PLANS[plan];
    if (!planConfig || !planConfig.priceId) {
      return res.status(400).json({ error: { message: 'Invalid plan' } });
    }

    let customerId = req.user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { userId: req.user.id },
      });
      customerId = customer.id;
      await req.user.update({ stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing?cancelled=true`,
      metadata: { userId: req.user.id, plan },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: { message: 'Failed to create checkout session' } });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: { message: 'Webhook signature verification failed' } });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const plan = session.metadata.plan;
      await User.update({ plan }, { where: { id: userId } });
      await Subscription.upsert({
        userId,
        stripeSubscriptionId: session.subscription,
        plan,
        status: 'active',
      });
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const subscription = await Subscription.findOne({
        where: { stripeSubscriptionId: sub.id },
      });
      if (subscription) {
        await subscription.update({ status: 'cancelled', plan: 'free' });
        await User.update({ plan: 'free' }, { where: { id: subscription.userId } });
      }
      break;
    }
  }

  res.json({ received: true });
};
