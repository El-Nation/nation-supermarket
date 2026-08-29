import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string;
        let queryStr = `
            SELECT 
                o.id, o.order_reference, o.guest_data, o.delivery_type, 
                o.total_amount, o.order_status, o.payment_status, o.delivery_address, o.created_at,
                u.name as registered_customer_name, u.email as registered_customer_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
        `;
        const values: any[] = [];
        if (search) {
            queryStr += ` WHERE o.order_reference ILIKE $1 OR u.name ILIKE $1 OR u.email ILIKE $1 OR o.guest_data::text ILIKE $1`;
            values.push(`%${search}%`);
        }
        queryStr += ` ORDER BY o.created_at DESC`;
        
        const query = await pool.query(queryStr, values);
        res.json(query.rows);
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: 'Error retrieving active order pipelines.' });
    }
};

export const getCustomerOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const query = await pool.query(`
            SELECT 
                id, order_reference, delivery_type, 
                total_amount, order_status, payment_status, delivery_address, created_at
            FROM orders
            WHERE user_id = $1
            ORDER BY created_at DESC
        `, [userId]);
        res.json(query.rows);
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: 'Error mapping dynamic customer order structures.' });
    }
};
