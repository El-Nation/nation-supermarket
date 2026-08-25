import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        // Fetch reviews seamlessly mapping BOTH authenticated users and unauthenticated guests dynamically using robust LEFT JOIN architecture globally
        const result = await pool.query(
            `SELECT r.*, COALESCE(u.name, r.guest_name) as user_name 
             FROM reviews r 
             LEFT JOIN users u ON r.user_id = u.id 
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
        const { rating, comment, guest_name } = req.body;
        
        // Contextually resolve user dynamically (could be undefined if it's the public guest endpoint natively)
        const user = (req as any).user;
        const userId = user ? user.id : null;

        let isVerified = false;
        
        // Only run native verification sequence if an active account is linked dynamically
        if (userId) {
            const verifyPurchase = await pool.query(
                `SELECT 1 FROM order_items oi
                 JOIN orders o ON oi.order_id = o.id
                 WHERE o.user_id = $1 AND oi.product_id = $2`,
                [userId, productId]
            );
            isVerified = verifyPurchase.rows.length > 0;
        }

        const result = await pool.query(
            `INSERT INTO reviews (product_id, user_id, rating, comment, is_verified_purchase, guest_name)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [productId, userId, rating, comment, isVerified, guest_name || 'Guest User']
        );

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error("Add Review fault:", error);
        res.status(500).json({ message: 'Error deploying user review seamlessly.' });
    }
};
