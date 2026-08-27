import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getAdminReviews = async (req: Request, res: Response) => {
    try {
        const productReviews = await pool.query(`
            SELECT r.*, p.name as product_name, u.name as db_user_name 
            FROM reviews r 
            LEFT JOIN products p ON r.product_id = p.id
            LEFT JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        `);

        const storeFeedback = await pool.query(`
            SELECT * FROM store_feedbacks ORDER BY created_at DESC
        `);

        res.status(200).json({
            product_reviews: productReviews.rows,
            store_feedback: storeFeedback.rows
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error fetching admin reviews natively' });
    }
};

export const approveStoreFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE store_feedbacks SET is_approved = true WHERE id = $1', [id]);
        res.status(200).json({ message: 'Feedback approved for public landing page natively' });
    } catch (e) {
        res.status(500).json({ message: 'Error approving store feedback natively' });
    }
};

export const deleteProductReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
        res.status(200).json({ message: 'Product review permanently deleted securely' });
    } catch (e) {
        res.status(500).json({ message: 'Error deleting product review securely' });
    }
};

export const deleteStoreFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM store_feedbacks WHERE id = $1', [id]);
        res.status(200).json({ message: 'Store feedback permanently deleted securely' });
    } catch (e) {
        res.status(500).json({ message: 'Error deleting store feedback securely' });
    }
};
