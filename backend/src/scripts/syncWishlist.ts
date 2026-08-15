import { pool } from '../config/db';

const syncWishlistTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS wishlist (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            );
        `);
        console.log('✅ Wishlist table mapped successfully natively.');
        process.exit(0);
    } catch(e) {
        console.error('❌ Failed structuring wishlist:', e);
        process.exit(1);
    }
};

syncWishlistTable();
