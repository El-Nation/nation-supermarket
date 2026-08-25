const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        await pool.query(`INSERT INTO categories (name, slug) SELECT 'Pharmacy', 'pharmacy' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Pharmacy')`);
        await pool.query(`INSERT INTO categories (name, slug) SELECT 'Fragrance', 'fragrance' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Fragrance')`);
        await pool.query(`INSERT INTO categories (name, slug) SELECT 'Kids Provisions', 'kids-provisions' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Kids Provisions')`);
        await pool.query(`INSERT INTO categories (name, slug) SELECT 'Health & Beauty', 'health-beauty' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Health & Beauty')`);
        await pool.query(`INSERT INTO categories (name, slug) SELECT 'Baby Care', 'baby-care' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Baby Care')`);
        await pool.query(`INSERT INTO categories (name, slug) SELECT 'Household', 'household' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Household')`);
        console.log("Successfully securely seeded categories with Live Database URL!");
    } catch(e) {
        console.error("DB Seed Error: ", e);
    } finally {
        pool.end();
    }
}
main();
