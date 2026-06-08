import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getDB } from '../services/dbService';

export const getUsage = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const db = getDB();

  try {
    const user = await db.get('SELECT subscription_status, trial_ends_at FROM users WHERE id = ?', [userId]);
    const today = new Date().toISOString().split('T')[0];
    const usage = await db.get(
      'SELECT COUNT(*) as count FROM usage_tracking WHERE user_id = ? AND date(created_at) = ?',
      [userId, today]
    );

    let isTrialActive = false;
    let daysRemaining = 0;
    if (user.trial_ends_at) {
      const trialEnd = new Date(user.trial_ends_at);
      const now = new Date();
      isTrialActive = trialEnd > now;
      daysRemaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    }

    let status = user.subscription_status;
    if (status === 'free' && isTrialActive) {
      status = 'trialing';
    }

    res.json({
      subscriptionStatus: status,
      trialEndsAt: user.trial_ends_at,
      daysRemaining,
      dailyUsage: usage.count,
      dailyLimit: (status === 'paid' || status === 'trialing') ? 'unlimited' : 5
    });
  } catch (error) {
    console.error('Usage error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
