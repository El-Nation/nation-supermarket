import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const query = await pool.query(`
            SELECT 
                o.id, o.order_reference, o.guest_data, o.delivery_type, 
                o.total_amount, o.order_status, o.payment_status, o.delivery_address, o.created_at,
                u.name as registered_customer_name, u.email as registered_customer_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);
        res.json(query.rows);
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: 'Error retrieving active order pipelines.' });
    }
};
