import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { initDB } from './services/dbService';

const PORT = Number(process.env.PORT) || 3001;

const start = async () => {
  try {
    await initDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
