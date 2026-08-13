import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

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
