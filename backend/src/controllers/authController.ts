import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { User } from '../models/User';
import { pool } from '../config/db';
import { send2FAToggle } from '../utils/mailer';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const generateToken = (res: Response, userId: number) => {
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, phone, address } = req.body;

    try {
        const userExists = await User.findByEmail(email);
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name, email, password: hashedPassword, phone, address, role: 'customer'
        });

        generateToken(res, user.id);
        res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        console.error('CRITICAL BACKEND ERROR IN REGISTER:', error);
        res.status(500).json({ message: 'Server error check logs' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password, token: twoFactorToken } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        // 2FA Admin Flow Validation
        if (user.two_factor_enabled && user.role === 'admin') {
            if (!twoFactorToken) {
                res.status(403).json({ message: '2FA token required', requires2FA: true });
                return;
            }
            const verified = speakeasy.totp.verify({
                secret: user.two_factor_secret,
                encoding: 'base32',
                token: twoFactorToken
            });
            if (!verified) {
                res.status(401).json({ message: 'Invalid 2FA token' });
                return;
            }
        }

        generateToken(res, user.id);
        res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const logoutUser = (req: Request, res: Response): void => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const generate2FA = async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
        res.status(403).json({ message: 'Requires admin role to enable 2FA.' });
        return;
    }

    const secret = speakeasy.generateSecret({ name: `NationSupermarket (${user.email})` });
    
    await User.update2FA(user.id, secret.base32, false);

    qrcode.toDataURL(secret.otpauth_url || '', (err, data_url) => {
        if (err) {
            res.status(500).json({ message: 'Error generating QR code' });
            return;
        }
        res.json({ secret: secret.base32, qrCode: data_url });
    });
};

export const verify2FA = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    const user = (req as any).user;

    const dbUser = await User.findById(user.id);

    const verified = speakeasy.totp.verify({
        secret: dbUser.two_factor_secret,
        encoding: 'base32',
        token
    });

    if (verified) {
        await User.update2FA(user.id, dbUser.two_factor_secret, true);
        send2FAToggle(dbUser.email, true);
        res.json({ message: '2FA verified and enabled successfully.' });
    } else {
        res.status(400).json({ message: 'Invalid token. Verification failed.' });
    }
};

export const disable2FA = async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user;
    await pool.query('UPDATE users SET two_factor_enabled = false, two_factor_secret = null WHERE id = $1', [user.id]);
    send2FAToggle(user.email, false);
    res.json({ message: '2FA security constraint successfully removed.' });
};
