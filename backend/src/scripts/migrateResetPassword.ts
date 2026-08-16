import { pool } from '../config/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const runMigration = async () => {
    try {
        console.log('Running Reset Password migration locally...');
        
        await pool.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
            ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;
        `);
        
        console.log('Success: reset_token columns added correctly.');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        pool.end();
    }
};

runMigration();
