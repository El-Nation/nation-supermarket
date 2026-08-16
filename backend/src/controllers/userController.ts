import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db';
import { sendPasswordChange, sendEmailChangeWarning, sendEmailChangeConfirmation, sendPhoneChange } from '../utils/mailer';
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await pool.query('SELECT id, name, email, phone, role, created_at, account_status FROM users ORDER BY created_at DESC');
        res.json(users.rows);
    } catch(e) {
        res.status(500).json({message: 'Server error retrieving users.'});
    }
};

export const getAdminProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const result = await pool.query('SELECT name, email, phone, two_factor_enabled, avatar_url FROM users WHERE id = $1', [userId]);
        res.json(result.rows[0]);
    } catch(e) {
        res.status(500).json({ message: 'Error fetching global admin security state.' });
    }
};

export const updateAdminProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { current_password, new_password, new_email, new_phone } = req.body;
        const userId = (req as any).user.id;

        const dbUser = await User.findById(userId);
        
        // Security check if modifying sensitive parameters
        if (req.body.current_password || new_password || (new_email && new_email !== dbUser.email) || (new_phone && new_phone !== dbUser.phone)) {
            const isMatch = await bcrypt.compare(current_password || '', dbUser.password);
            if (!isMatch) {
                res.status(401).json({ message: 'Invalid current password. Security block.' });
                return;
            }
        }

        let passwordChanged = false;
        let emailChanged = false;
        let phoneChanged = false;
        
        let newHashedPass = dbUser.password;
        if(new_password) {
            const salt = await bcrypt.genSalt(10);
            newHashedPass = await bcrypt.hash(new_password, salt);
            passwordChanged = true;
        }

        const emailToSave = new_email || dbUser.email;
        if (new_email && new_email !== dbUser.email) emailChanged = true;
        
        const phoneToSave = new_phone || dbUser.phone;
        if (new_phone && new_phone !== dbUser.phone) phoneChanged = true;

        let avatarToSave = dbUser.avatar_url;
        if (req.body.remove_avatar === 'true') {
            avatarToSave = null;
        } else if (req.file) { // Provided by uploadMedia.single('avatar')
            avatarToSave = req.file.path;
        }

        await pool.query(
            'UPDATE users SET email = $1, phone = $2, password = $3, avatar_url = $4 WHERE id = $5',
            [emailToSave, phoneToSave, newHashedPass, avatarToSave, userId]
        );

        // Security emails explicitly flexibly natively triggered logically
        if(passwordChanged) await sendPasswordChange(emailToSave);
        if(phoneChanged) await sendPhoneChange(emailToSave);
        if(emailChanged) {
            await sendEmailChangeWarning(dbUser.email);
            await sendEmailChangeConfirmation(emailToSave);
        }

        res.json({ message: 'Admin Profile updated securely.', avatar_url: avatarToSave });
    } catch(e) {
        res.status(500).json({ message: 'Failed to apply security profile updates.' });
    }
};

export const updateCustomerProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { name, email, phone } = req.body;
        
        await pool.query(
            'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone) WHERE id = $4',
            [name, email, phone, userId]
        );
        res.json({ message: 'Customer profile updated natively.' });
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: 'Error mapping customer profile updates.' });
    }
};

export const changeCustomerPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { current_password, new_password, confirm_password } = req.body;
        
        if (new_password !== confirm_password) {
            res.status(400).json({ message: 'New passwords heavily mismatch structurally.' });
            return;
        }

        const dbUser = await User.findById(userId);
        const isMatch = await bcrypt.compare(current_password, dbUser.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid current password. Operation completely blocked.' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(new_password, salt);
        
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, userId]);
        await sendPasswordChange(dbUser.email);
        
        res.json({ message: 'Customer secure password safely swapped natively.' });
    } catch(e) {
        console.error(e);
        res.status(500).json({ message: 'Error dynamically routing customer password payload.' });
    }
};

export const getCustomerProfileSecure = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const result = await pool.query('SELECT two_factor_enabled FROM users WHERE id = $1', [userId]);
        res.json(result.rows[0]);
    } catch(e) {
        res.status(500).json({ message: 'Error fetching customer strict security boundaries.' });
    }
};
