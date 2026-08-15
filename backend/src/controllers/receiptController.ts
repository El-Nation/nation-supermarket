import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getAllReceipts = async (req: Request, res: Response) => {
    try {
        const query = await pool.query(`
            SELECT r.*, p.payment_reference 
            FROM receipts r 
            JOIN payments p ON r.payment_id = p.id 
            ORDER BY r.created_at DESC
        `);
        res.json(query.rows);
    } catch(e) {
        res.status(500).json({message: 'Failed to access digital archives.'});
    }
};
