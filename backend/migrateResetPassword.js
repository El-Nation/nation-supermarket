const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'nation_supermarket',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});
async function run() {
    try {
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255), ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;`);
        console.log('Migration OK');
    } catch(e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
run();
