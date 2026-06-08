import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

let db: Database;

export const initDB = async () => {
  db = await open({
    filename: path.join(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database
  });

  const schema = fs.readFileSync(path.join(__dirname, '../config/schema.sql'), 'utf8');
  await db.exec(schema);

  // Migration: Add trial_ends_at if it doesn't exist
  try {
    await db.exec('ALTER TABLE users ADD COLUMN trial_ends_at DATETIME;');
    console.log('Migration: Added trial_ends_at column');
  } catch (err: any) {
    if (err.message.includes('duplicate column name')) {
      // Column already exists, ignore
    } else {
      console.error('Migration error:', err.message);
    }
  }

  console.log('Database initialized');
  return db;
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDB first.');
  }
  return db;
};
