import { pool } from '../config/db';
import dotenv from 'dotenv';
dotenv.config();

const runMigration = async () => {
    try {
        console.log('⏳ Running migration for 2FA...');
        await pool.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255);
            ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
        `);
        console.log('✅ Migration: Successfully added 2FA columns to users table.');
        process.exit(0);
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    }
};
runMigration();
