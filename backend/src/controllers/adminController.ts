import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getDashboardAnalytics = async (req: Request, res: Response) => {
    try {
        const { period } = req.query;
        let timeClause = '';
        if (period === 'today') {
            timeClause = 'AND DATE(created_at) = CURRENT_DATE';
        } else if (period === 'month') {
            timeClause = 'AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)';
        }

        const totalOrders = await pool.query(`SELECT COUNT(*) FROM orders WHERE 1=1 ${timeClause}`);
        const totalRevenue = await pool.query(`SELECT SUM(total_amount) FROM orders WHERE payment_status = 'paid' ${timeClause}`); 
        const todaySales = await pool.query("SELECT SUM(total_amount) FROM orders WHERE payment_status = 'paid' AND DATE(created_at) = CURRENT_DATE");
        const pendingOrdersCount = await pool.query("SELECT COUNT(*) FROM orders WHERE order_status = 'processing' AND payment_status = 'paid'");

        const recentOrders = await pool.query(`
            SELECT o.*, u.name as customer_name, u.phone as customer_phone 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC LIMIT 5
        `);
        
        const lowStockProducts = await pool.query("SELECT COUNT(*) FROM products WHERE stock_quantity < 5 AND status = 'active'");
        
        res.json({
            totalOrders: parseInt(totalOrders.rows[0].count),
            totalRevenue: parseFloat(totalRevenue.rows[0].sum) || 0,
            todaySales: parseFloat(todaySales.rows[0].sum) || 0,
            pendingOrdersCount: parseInt(pendingOrdersCount.rows[0].count),
            recentOrders: recentOrders.rows,
            lowStockCount: parseInt(lowStockProducts.rows[0].count)
        });
    } catch (e) {
        console.error('Analytics aggregation fault:', e);
        res.status(500).json({ message: 'Internal error generating analytics map.' });
    }
};
