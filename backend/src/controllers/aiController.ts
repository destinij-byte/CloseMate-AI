import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getDB } from '../services/dbService';
import { generateAIResponse } from '../services/aiService';

const FREE_TIER_LIMIT = 5;

const checkUsage = async (userId: number) => {
  const db = getDB();
  const user = await db.get('SELECT subscription_status, trial_ends_at FROM users WHERE id = ?', [userId]);
  
  if (user.subscription_status === 'paid') return true;

  // Check if trial is still active
  if (user.trial_ends_at) {
    const trialEnd = new Date(user.trial_ends_at);
    if (trialEnd > new Date()) {
      return true;
    }
  }

  const today = new Date().toISOString().split('T')[0];
  const usage = await db.get(
    'SELECT COUNT(*) as count FROM usage_tracking WHERE user_id = ? AND date(created_at) = ?',
    [userId, today]
  );

  return usage.count < FREE_TIER_LIMIT;
};

const trackUsage = async (userId: number, type: string) => {
  const db = getDB();
  await db.run(
    'INSERT INTO usage_tracking (user_id, request_type) VALUES (?, ?)',
    [userId, type]
  );
};

export const objectionHandle = async (req: AuthRequest, res: Response) => {
  const { objection, context } = req.body;
  const userId = req.user!.userId;

  if (!objection) return res.status(400).json({ message: 'Objection is required' });

  if (!(await checkUsage(userId))) {
    return res.status(403).json({ message: 'Daily limit reached. Upgrade for unlimited access.' });
  }

  try {
    const systemPrompt = "You are an expert sales consultant specializing in objection handling. Your goal is to provide a persuasive, empathetic, and professional script to overcome a specific sales objection.";
    const userPrompt = `Handle the following sales objection: "${objection}". Context: ${context || 'N/A'}. Provide a persuasive script to overcome it.`;
    const response = await generateAIResponse(userPrompt, systemPrompt);
    
    await trackUsage(userId, 'objection_handle');
    res.json({ script: response });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Error generating response' });
  }
};

export const generateScript = async (req: AuthRequest, res: Response) => {
  const { scenario, product, target_audience } = req.body;
  const userId = req.user!.userId;

  if (!scenario || !product) return res.status(400).json({ message: 'Scenario and product are required' });

  if (!(await checkUsage(userId))) {
    return res.status(403).json({ message: 'Daily limit reached. Upgrade for unlimited access.' });
  }

  try {
    const systemPrompt = "You are a professional sales script writer. Your goal is to generate high-converting sales scripts for various scenarios and products, tailored to the target audience.";
    const userPrompt = `Generate a sales script for the following scenario: "${scenario}" for the product: "${product}". Target audience: ${target_audience || 'Not specified'}.`;
    const response = await generateAIResponse(userPrompt, systemPrompt);

    await trackUsage(userId, 'generate_script');
    res.json({ script: response });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Error generating script' });
  }
};

export const suggestResponse = async (req: AuthRequest, res: Response) => {
  const { leadMessage, lastInteraction } = req.body;
  const userId = req.user!.userId;

  if (!leadMessage) return res.status(400).json({ message: 'Lead message is required' });

  if (!(await checkUsage(userId))) {
    return res.status(403).json({ message: 'Daily limit reached. Upgrade for unlimited access.' });
  }

  try {
    const systemPrompt = "You are a sales assistant helping a salesperson respond to a lead message. Your goal is to suggest a response that is engaging, helpful, and moves the conversation forward.";
    const userPrompt = `Suggest a response to this lead message: "${leadMessage}". Last interaction: ${lastInteraction || 'None'}.`;
    const response = await generateAIResponse(userPrompt, systemPrompt);

    await trackUsage(userId, 'suggest_response');
    res.json({ suggestion: response });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Error suggesting response' });
  }
};
