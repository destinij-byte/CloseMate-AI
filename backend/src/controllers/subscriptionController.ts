import Stripe from 'stripe';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getDB } from '../services/dbService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const email = req.user!.email;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'CloseMate AI Pro Plan',
            },
            unit_amount: 2900, // $29.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: email,
      metadata: {
        userId: userId.toString(),
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const db = getDB();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session.metadata?.userId;

    if (userId) {
      await db.run(
        'UPDATE users SET subscription_status = ?, stripe_customer_id = ? WHERE id = ?',
        ['paid', session.customer as string, userId]
      );
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any;
    const customerId = subscription.customer as string;

    await db.run(
      'UPDATE users SET subscription_status = ? WHERE stripe_customer_id = ?',
      ['free', customerId]
    );
  }

  res.json({ received: true });
};

export const getSubscriptionStatus = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const db = getDB();

  try {
    const user = await db.get('SELECT subscription_status, trial_ends_at FROM users WHERE id = ?', [userId]);
    
    let isTrialActive = false;
    if (user.trial_ends_at) {
      isTrialActive = new Date(user.trial_ends_at) > new Date();
    }

    let status = user.subscription_status;
    if (status === 'free' && isTrialActive) {
      status = 'trialing';
    }

    res.json({ tier: status });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
