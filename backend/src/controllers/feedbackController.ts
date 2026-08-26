import { Request, Response } from 'express';
import { pool } from '../config/db';

export const submitFeedback = async (req: Request, res: Response) => {
    try {
        const { rating, comment, guest_name } = req.body;
        
        const userName = guest_name || 'Verified Customer';

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Valid rating between 1 and 5 is required natively.' });
        }

        await pool.query(
            'INSERT INTO store_feedbacks (user_name, rating, comment, is_approved) VALUES ($1, $2, $3, false)',
            [userName, rating, comment]
        );

        res.status(201).json({ message: 'Thank you! Your feedback has been submitted for review.' });
    } catch (error) {
        console.error('Error submitting store feedback:', error);
        res.status(500).json({ message: 'Internal server error securely mapping feedback softly.' });
    }
};

export const getPublicFeedback = async (req: Request, res: Response) => {
    try {
        const fRes = await pool.query(
            'SELECT id, rating, comment, user_name, created_at FROM store_feedbacks WHERE is_approved = true ORDER BY created_at DESC LIMIT 15'
        );
        res.status(200).json(fRes.rows);
    } catch (error) {
        console.error('Error retrieving public feedback:', error);
        res.status(500).json({ message: 'Failed to securely fetch store testimonials flawlessly.' });
    }
};
