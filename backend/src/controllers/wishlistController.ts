import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getWishlist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const result = await pool.query(`
            SELECT w.product_id, p.name, p.price, p.stock_quantity, p.images
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = $1
            ORDER BY w.created_at DESC
        `, [userId]);

        const mapped = result.rows.map(r => ({
             product_id: r.product_id,
             name: r.name,
             price: r.price,
             stock_quantity: r.stock_quantity,
             image_url: r.images && Array.isArray(r.images) && r.images.length > 0 ? r.images[0] : ''
        }));

        res.json(mapped);
    } catch (e) {
        console.error("Wishlist fetch error:", e);
        res.status(500).json({ message: 'Internal error resolving customer wishlist.' });
    }
};

export const addToWishlist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { product_id } = req.body;
        
        await pool.query(
            `INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [userId, product_id]
        );
        res.status(201).json({ message: 'Product natively bound to wishlist successfully.' });
    } catch (e) {
        console.error("Wishlist add error:", e);
        res.status(500).json({ message: 'Error mapping product to customer wishlist.' });
    }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { product_id } = req.params;

        await pool.query(
            `DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2`,
            [userId, product_id]
        );
        res.json({ message: 'Product correctly extracted from wishlist natively.' });
    } catch (e) {
        console.error("Wishlist remove error:", e);
        res.status(500).json({ message: 'Error extracting product from wishlist.' });
    }
};
