import { pool } from '../config/db';

export class DeliveryZone {
    static async getAll(search?: string) {
        let query = 'SELECT * FROM delivery_zones';
        const values: any[] = [];
        if (search) {
            query += ` WHERE name ILIKE $1 OR areas ILIKE $1`;
            values.push(`%${search}%`);
        }
        query += ` ORDER BY name ASC`;
        const res = await pool.query(query, values);
        return res.rows;
    }

    static async getActive() {
        const res = await pool.query("SELECT * FROM delivery_zones WHERE status = 'active' ORDER BY name ASC");
        return res.rows;
    }

    static async create(name: string, areas: string, fee: number) {
        const res = await pool.query(
            "INSERT INTO delivery_zones (name, areas, fee) VALUES ($1, $2, $3) RETURNING *",
            [name, areas, fee]
        );
        return res.rows[0];
    }

    static async update(id: number, data: { name?: string; areas?: string; fee?: number; status?: string }) {
        const res = await pool.query(
            `UPDATE delivery_zones SET 
                name = COALESCE($1, name),
                areas = COALESCE($2, areas),
                fee = COALESCE($3, fee),
                status = COALESCE($4, status)
             WHERE id = $5 RETURNING *`,
            [data.name, data.areas, data.fee, data.status, id]
        );
        return res.rows[0];
    }

    static async delete(id: number) {
        const res = await pool.query('DELETE FROM delivery_zones WHERE id = $1 RETURNING *', [id]);
        return res.rows[0];
    }
}
