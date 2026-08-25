import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        // Fetch reviews specifically joined securely with explicit user context gracefully seamlessly
        const result = await pool.query(
            `SELECT r.*, u.name as user_name 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = $1 
             ORDER BY r.created_at DESC`,
            [productId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Reviews mapping error:", error);
        res.status(500).json({ message: 'Error mapping verified structural reviews organically.' });
    }
};

export const addReview = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = (req as any).user.id;

        // Securely intercept previous orders specifically to organically map true native Verified Purchase tags explicitly securely
        const verifyPurchase = await pool.query(
            `SELECT 1 FROM order_items oi
             JOIN orders o ON oi.order_id = o.id
             WHERE o.user_id = $1 AND oi.product_id = $2`,
            [userId, productId]
        );
        const isVerified = verifyPurchase.rows.length > 0;

        const result = await pool.query(
            `INSERT INTO reviews (product_id, user_id, rating, comment, is_verified_purchase)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [productId, userId, rating, comment, isVerified]
        );

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error("Add Review fault:", error);
        res.status(500).json({ message: 'Error deploying user review seamlessly.' });
    }
};
