import { pool } from '../config/db';

export class StoreSetting {
    static async get(key: string) {
        const res = await pool.query('SELECT value FROM store_settings WHERE key = $1', [key]);
        return res.rows[0]?.value || null;
    }

    static async getAll() {
        const res = await pool.query('SELECT * FROM store_settings');
        return res.rows;
    }

    static async update(key: string, value: string) {
        const res = await pool.query(
            'INSERT INTO store_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value RETURNING *',
            [key, value]
        );
        return res.rows[0];
    }
}
