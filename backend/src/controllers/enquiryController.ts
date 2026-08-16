import { Request, Response } from 'express';
import { pool } from '../config/db';
import { triggerSystemNotification } from '../utils/notificationHelper';
import { sendSystemEmail } from '../utils/mailer';

export const createEnquiry = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message, user_id } = req.body;
        
        await pool.query(
            `INSERT INTO enquiries (name, email, subject, message, user_id, status) VALUES ($1, $2, $3, $4, $5, 'new')`,
            [name, email, subject, message, user_id || null]
        );

        await triggerSystemNotification(null, 'New Customer Enquiry', `A new structured communication from ${name} (${email}) has explicitly dropped into your inbox.`);
        
        if (process.env.SMTP_USER) {
            await sendSystemEmail(
                process.env.SMTP_USER,
                'New Customer Enquiry Received',
                `<p>A customer has just submitted an enquiry.</p>
                 <p><strong>Name:</strong> ${name}<br/>
                 <strong>Email:</strong> ${email}<br/>
                 <strong>Subject:</strong> ${subject}</p>
                 <p><strong>Message:</strong><br/>${message}</p>`
            );
        }
        
        res.status(201).json({ message: 'Enquiry physically officially recorded perfectly natively.' });
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: 'Error logging enquiry safely.' });
    }
};

export const replyEnquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { replyMessage } = req.body;

        const enqQuery = await pool.query(`SELECT email, name FROM enquiries WHERE id = $1`, [id]);
        if(enqQuery.rows.length === 0) return res.status(404).json({ message: 'Enquiry missing formally.' });
        const enq = enqQuery.rows[0];

        await sendSystemEmail(enq.email, 'Reply from Nation Supermarket Support', `
            <div style="font-family:sans-serif; padding:20px; background:#f8fafc">
                <h3 style="color:#0f172a">Hello ${enq.name},</h3>
                <p style="color:#334155; font-size:16px;">We have received and securely reviewed your enquiry.</p>
                <div style="padding:15px; background:white; border-left:4px solid #0ea5e9; margin:20px 0;">
                    <p style="margin:0; font-style:italic;">${replyMessage}</p>
                </div>
                <p style="color:#64748b; font-size:14px;">Regards,<br/>Nation Supermarket Administration</p>
            </div>
        `);

        await pool.query(
            `UPDATE enquiries SET status = 'replied' WHERE id = $1`,
            [id]
        );

        res.json({ message: 'Enquiry reliably formally safely replied and closed correctly.' });
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: 'Error parsing generic enquiry updates.' });
    }
};
