import { pool } from '../config/db';

async function migrateSlugs() {
    console.log("Starting local DB slug migration & collision handling...");
    try {
        // Add slug column safely
        await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255);`);
        
        // Fetch all products
        const products = await pool.query('SELECT id, name FROM products');
        
        for (const product of products.rows) {
            let baseSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            let slug = baseSlug;
            
            // Loop until unique
            let isUnique = false;
            let counter = 1;
            while (!isUnique) {
                const check = await pool.query('SELECT id FROM products WHERE slug = $1 AND id != $2', [slug, product.id]);
                if (check.rows.length === 0) {
                    isUnique = true;
                } else {
                    slug = `${baseSlug}-${counter}`; // Append collision counter safely
                    counter++;
                }
            }
            
            await pool.query('UPDATE products SET slug = $1 WHERE id = $2', [slug, product.id]);
            console.log(`Updated product ${product.id} -> slug: ${slug}`);
        }

        // Add UNIQUE constraint only if it doesn't already exist
        const constraintCheck = await pool.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'products' AND constraint_type = 'UNIQUE' AND constraint_name = 'products_slug_key'
        `);
        if (constraintCheck.rows.length === 0) {
            await pool.query(`ALTER TABLE products ADD CONSTRAINT products_slug_key UNIQUE (slug);`);
            console.log("Added UNIQUE constraint on products.slug");
        }
        
        console.log("Migration thoroughly completed on local DB!");
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        await pool.end();
    }
}

migrateSlugs();
