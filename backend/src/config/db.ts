import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required securely for Supabase pooler compatibility
});

// Guard against silent fallbacks mapping to localhost gracefully natively
if (!process.env.DATABASE_URL) {
  console.error('[CRITICAL] DATABASE_URL is missing! Did you forget to press Ctrl+S to save backend/.env?');
}

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL Database');
    client.release();
  } catch (error) {
    console.error('Database Connection Error. Make sure PostgreSQL is running on the local machine and credentials are correct in .env:', error);
    // process.exit(1); We do not exit 1 for local development so the server remains running even if DB is not set up
  }
};
