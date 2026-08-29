import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getAllReceipts = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string;
        let queryStr = `
            SELECT r.*, p.payment_reference 
            FROM receipts r 
            JOIN payments p ON r.payment_id = p.id 
        `;
        const values: any[] = [];
        if (search) {
            queryStr += ` WHERE p.payment_reference ILIKE $1 OR r.receipt_data::text ILIKE $1`;
            values.push(`%${search}%`);
        }
        queryStr += ` ORDER BY r.created_at DESC`;
        const query = await pool.query(queryStr, values);
        res.json(query.rows);
    } catch(e) {
        res.status(500).json({message: 'Failed to access digital archives.'});
    }
};
