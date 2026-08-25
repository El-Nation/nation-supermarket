import pool from '../config/db';

async function migrate() {
    try {
        await pool.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon VARCHAR(20) DEFAULT '📦'`);
        console.log("Migration successful: DB dynamically upgraded to support custom category emojis!");
    } catch(e) {
        console.error("Migration Error:", e);
    } finally {
        process.exit(0);
    }
}
migrate();
