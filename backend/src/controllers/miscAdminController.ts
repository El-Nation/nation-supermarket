import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string;
        let queryStr = `SELECT id, order_id, payment_reference, amount, payment_status, gateway_reference, payment_date as created_at FROM payments`;
        const values: any[] = [];
        if (search) {
            queryStr += ` WHERE payment_reference ILIKE $1 OR gateway_reference ILIKE $1 OR CAST(order_id AS TEXT) ILIKE $1`;
            values.push(`%${search}%`);
        }
        queryStr += ` ORDER BY payment_date DESC`;
        const query = await pool.query(queryStr, values);
        res.json(query.rows);
    } catch(e) { res.status(500).json({message: 'Failed fetching payment matrices'}); }
};

export const getEnquiries = async (req: Request, res: Response) => {
    try {
        const query = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC');
        res.json(query.rows);
    } catch(e) { res.status(500).json({message: 'Failed fetching enquiries.'}); }
};

export const getNotifications = async (req: Request, res: Response) => {
    try { 
        const query = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
        res.json(query.rows);
    } catch(e) { res.status(500).json({message: 'Failed fetching alerts'}); }
};

export const markNotificationRead = async (req: Request, res: Response) => {
    try {
        await pool.query('UPDATE notifications SET is_read = true WHERE id = $1', [req.params.id]);
        res.json({ message: 'Marked perfectly explicitly correctly' });
    } catch(e) { res.status(500).json({}); }
};
