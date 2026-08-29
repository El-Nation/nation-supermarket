import { pool } from '../config/db';

export class Category {
    static async create(name: string, slug: string, icon: string = '📦') {
        const result = await pool.query(
            'INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3) RETURNING *',
            [name, slug, icon]
        );
        return result.rows[0];
    }

    static async getAll(search?: string) {
        let query = `SELECT * FROM categories`;
        const values: any[] = [];
        if (search) {
            query += ` WHERE name ILIKE $1 OR slug ILIKE $1`;
            values.push(`%${search}%`);
        }
        query += ` ORDER BY created_at DESC`;
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async delete(id: number) {
        // Automatically sets category_id to NULL in products via ON DELETE SET NULL
        const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}
