import { pool } from '../config/db';

const fixCategories = async () => {
    try {
        const mappings: Record<string, string> = {
            "Household": "🧽",
            "Pharmacy": "💊",
            "Fragrance": "🌸",
            "Kids Provisions": "🧸",
            "Laundry": "🧺",
            "Provisions": "🛒",
            "Kitchen Appliances": "🧑‍🍳",
            "Men's clothing": "🥼",
            "Baby Care": "🍼",
            "Pet Supplies": "🐕"
        };
        
        for (const [name, icon] of Object.entries(mappings)) {
            const res = await pool.query(
                `UPDATE categories SET icon = $1 WHERE name = $2 RETURNING *`,
                [icon, name]
            );
            if(res.rowCount !== 0) console.log(`Updated ${name} successfully natively -> ${icon}`);
        }
        
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        pool.end();
    }
};

fixCategories();
