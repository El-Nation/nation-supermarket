import { pool } from '../config/db';

export const triggerSystemNotification = async (userId: number | null, title: string, message: string) => {
    try {
        await pool.query(
            `INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)`,
            [userId, title, message]
        );
    } catch(e) {
        console.error('Failed generating generic system notification securely.', e);
    }
};
