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

    static async getAll() {
        const result = await pool.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            ORDER BY p.created_at DESC
        `);
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
