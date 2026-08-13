import { pool } from '../config/db';

export class User {
    static async findByEmail(email: string) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findById(id: number) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async create(user: any) {
        const result = await pool.query(
            'INSERT INTO users (name, email, phone, role, password, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [user.name, user.email, user.phone, user.role || 'customer', user.password, user.address || null]
        );
        return result.rows[0];
    }

    static async update2FA(id: number, secret: string, isEnabled: boolean) {
        await pool.query(
            'UPDATE users SET two_factor_secret = $1, two_factor_enabled = $2 WHERE id = $3',
            [secret, isEnabled, id]
        );
    }
}
