import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../services/dbService';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const db = getDB();
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
      "INSERT INTO users (email, password, trial_ends_at) VALUES (?, ?, datetime('now', '+14 days'))",
      [email, hashedPassword]
    );

    const newUser = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);

    const token = jwt.sign({ userId: result.lastID, email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ 
      token, 
      user: { 
        id: result.lastID, 
        email, 
        subscriptionStatus: 'free',
        trialExpiresAt: newUser.trial_ends_at
      } 
    });
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const db = getDB();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        subscriptionStatus: user.subscription_status,
        trialExpiresAt: user.trial_ends_at
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
