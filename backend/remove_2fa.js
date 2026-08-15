const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'nation_supermarket',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT) || 5432
});

async function unlock() {
    try {
        console.log("Connecting database via native client...");
        await pool.query("UPDATE users SET two_factor_enabled = false, two_factor_secret = null WHERE role = 'admin'");
        console.log("Admin successfully unlocked.");
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
unlock();
