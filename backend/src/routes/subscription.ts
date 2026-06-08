import { Router } from 'express';
import { createCheckoutSession, handleWebhook, getSubscriptionStatus } from '../controllers/subscriptionController';
import { authenticateToken } from '../middleware/auth';
import express from 'express';

const router = Router();

router.post('/create-checkout-session', authenticateToken, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.get('/status', authenticateToken, getSubscriptionStatus);

export default router;
