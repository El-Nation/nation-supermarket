import { pool } from '../config/db';

export class Product {
    static async create(data: any) {
        const result = await pool.query(
            `INSERT INTO products 
            (name, description, price, discount, category_id, stock_quantity, images, status, is_featured) 
            VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9) RETURNING *`,
            [
                data.name, data.description || null, data.price, data.discount || 0,
                data.category_id || null, data.stock_quantity || 0, data.images || '[]',
                data.status || 'active', data.is_featured || false
            ]
        );
        return result.rows[0];
    }

    static async getAll(search?: string) {
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
        `;
        const values: any[] = [];
        if (search) {
            query += ` WHERE p.name ILIKE $1 OR p.description ILIKE $1 OR p.slug ILIKE $1 OR c.name ILIKE $1 `;
            values.push(`%${search}%`);
        }
        query += ` ORDER BY p.created_at DESC`;
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async getById(id: number) {
        const result = await pool.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = $1
        `, [id]);
        return result.rows[0];
    }

    static async getByIdOrSlug(identifier: string | number) {
        let query;
        let values;
        
        // If numeric, check both ID and slug fallback
        if (/^\d+$/.test(String(identifier))) {
            query = `
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.id = $1 OR p.slug = $2
            `;
            values = [Number(identifier), String(identifier)];
        } else {
            // alphanumeric slug explicitly
            query = `
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.slug = $1
            `;
            values = [String(identifier)];
        }
        
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async getPublicFiltered(queryParams: any) {
        let queryText = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.status = 'active'
        `;
        const values: any[] = [];
        let valueCount = 1;

        if (queryParams.search) {
            queryText += ` AND (p.name ILIKE $${valueCount} OR p.description ILIKE $${valueCount} OR c.name ILIKE $${valueCount})`;
            values.push(`%${queryParams.search}%`);
            valueCount++;
        }
        if (queryParams.category) {
            if (!isNaN(Number(queryParams.category))) {
                queryText += ` AND p.category_id = $${valueCount}`;
                values.push(queryParams.category);
            } else {
                queryText += ` AND c.slug = $${valueCount}`;
                values.push(queryParams.category);
            }
            valueCount++;
        }
        if (queryParams.minPrice) {
            queryText += ` AND p.price >= $${valueCount}`;
            values.push(queryParams.minPrice);
            valueCount++;
        }
        if (queryParams.maxPrice) {
            queryText += ` AND p.price <= $${valueCount}`;
            values.push(queryParams.maxPrice);
            valueCount++;
        }
        if (queryParams.is_featured === 'true') {
            queryText += ` AND p.is_featured = true`;
        }
        if (queryParams.special_offers === 'true') {
            queryText += ` AND p.discount > 0`;
        }

        if (queryParams.sort === 'price_asc') {
            queryText += ` ORDER BY p.price ASC`;
        } else if (queryParams.sort === 'price_desc') {
            queryText += ` ORDER BY p.price DESC`;
        } else {
            queryText += ` ORDER BY p.created_at DESC`;
        }
        
        if (queryParams.limit) {
            queryText += ` LIMIT $${valueCount}`;
            values.push(queryParams.limit);
            valueCount++;
        }

        const result = await pool.query(queryText, values);
        return result.rows;
    }

    static async update(id: number, data: any) {
        // Dynamic update query (ignoring images array complexity for brevity, handled separately usually)
        const result = await pool.query(
            `UPDATE products SET 
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                price = COALESCE($3, price),
                stock_quantity = COALESCE($4, stock_quantity),
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 RETURNING *`,
            [data.name, data.description, data.price, data.stock_quantity, id]
        );
        return result.rows[0];
    }

    static async delete(id: number) {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}
