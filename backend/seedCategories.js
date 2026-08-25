const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

async function main() {
    try {
        await pool.query(`INSERT INTO categories (name, slug) VALUES ('Pharmacy', 'pharmacy') ON CONFLICT (slug) DO NOTHING`);
        await pool.query(`INSERT INTO categories (name, slug) VALUES ('Fragrance', 'fragrance') ON CONFLICT (slug) DO NOTHING`);
        await pool.query(`INSERT INTO categories (name, slug) VALUES ('Kids Provisions', 'kids-provisions') ON CONFLICT (slug) DO NOTHING`);
        await pool.query(`INSERT INTO categories (name, slug) VALUES ('Health & Beauty', 'health-beauty') ON CONFLICT (slug) DO NOTHING`);
        await pool.query(`INSERT INTO categories (name, slug) VALUES ('Baby Care', 'baby-care') ON CONFLICT (slug) DO NOTHING`);
        await pool.query(`INSERT INTO categories (name, slug) VALUES ('Household', 'household') ON CONFLICT (slug) DO NOTHING`);
        console.log("Successfully seeded categories!");
    } catch(e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
main();
