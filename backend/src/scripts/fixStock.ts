import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const fixStock = async () => {
    try {
        console.log("Restoring stock levels natively sequentially...");
        await pool.query('UPDATE products SET stock_quantity = 50 WHERE stock_quantity <= 0');
        console.log("Successfully normalized out of stock products explicitly!");
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
};

fixStock();
