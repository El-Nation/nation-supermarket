import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import crypto from 'crypto';
import { User } from '../models/User';
import { pool } from '../config/db';
import { send2FAToggle, sendSystemEmail, sendResetEmail, notifyGlobalAdmin, generateEmailHTML } from '../utils/mailer';
import { triggerSystemNotification } from '../utils/notificationHelper';

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

        // Formally intercept registration lifecycle to dispatch admin signals natively.
        try {
            await triggerSystemNotification(null, 'Customer Registration', `A new customer account was authenticated by ${name} (${email}).`);
            
            // Notify Admin
            await notifyGlobalAdmin(
                'New Customer Registration Notification',
                `<p>A brand new customer has efficiently joined Nation Supermarket securely.</p>
                 <p><strong>Name:</strong> ${name}<br/>
                 <strong>Email:</strong> ${email}</p>`
            );

            // Welcome Customer
            const html = generateEmailHTML(
                `Welcome to Nation Supermarket, ${name}!`,
                '<p>Your account has been authenticated effectively and securely.</p><p>We are thrilled to welcome you to the Nation Supermarket platform. You can now securely manage your profile, track digital receipts, and checkout properly natively.</p><p>Enjoy an incredible online shopping experience flawlessly.</p>',
                { text: 'Start Shopping', url: 'https://nationsupermarket.eghedev.com' }
            );
            await sendSystemEmail(
                email,
                'Welcome to Nation Supermarket',
                html
            );
        } catch (skip) {}

        generateToken(res, user.id);
        res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone || '' });
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

        // Universal 2FA Flow Validation
        if (user.two_factor_enabled) {
            if (!twoFactorToken) {
                res.status(403).json({ message: '2FA token required', requires2FA: true });
                return;
            }
            const verified = speakeasy.totp.verify({
                secret: user.two_factor_secret,
                encoding: 'base32',
                token: twoFactorToken,
                window: 4
            });
            if (!verified) {
                res.status(401).json({ message: 'Invalid 2FA token' });
                return;
            }
        }


        if (user.role === 'admin') {
            const html = generateEmailHTML(
                'Admin Dashboard Authentication', 
                '<p>A successful secured login to the Nation Supermarket Admin Dashboard was safely executed statically using your administrative credentials natively.</p><p>Please structurally engage with vigilance.</p>'
            );
            await sendSystemEmail(user.email, 'Security Alert: Admin Dashboard Login', html);
        }

        generateToken(res, user.id);
        res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone || '', avatar_url: user.avatar_url || '' });
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
        token,
        window: 4
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

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();
    console.log(`\n[AUTH] forgotPassword invoked for email: ${normalizedEmail}`);
    try {
        const user = await User.findByEmail(normalizedEmail);
        if (user) {
            console.log(`[AUTH] User found in DB. Generating token...`);
            const token = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            const expiry = new Date(Date.now() + 60 * 60 * 1000);
            
            await User.saveResetToken(user.id, hashedToken, expiry);
            console.log(`[AUTH] Token securely persisted. Handing off to mailer...`);
            
            const sent = await sendResetEmail(email, token);
            if (!sent) {
                console.error(`[AUTH] CRITICAL ERROR: sendResetEmail failed for ${email}`);
            } else {
                console.log(`[AUTH] Reset email successfully transmitted to SMTP.`);
            }
            res.json({ message: 'Reset link sent! Check your email.' });
        } else {
            console.warn(`[AUTH] WARNING: Email ${normalizedEmail} not found in DB. Returning 404.`);
            res.status(404).json({ message: 'Invalid email address' });
        }
    } catch (e) {
        console.error('[AUTH] Exception caught in forgotPassword loop:', e);
        res.status(500).json({ message: 'Server error' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findByResetToken(hashedToken);
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired reset token.' });
            return;
        }
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        await User.updatePassword(user.id, passwordHash);
        
        const html = generateEmailHTML(
            'Password Security Executed', 
            '<p>Your account password was just reset cleanly via the forgotten token loop.</p><p>If you did not execute this structural reset natively, please contact support securely immediately as your external matrix has been compromised organically.</p>'
        );
        await sendSystemEmail(user.email, 'Your Nation Supermarket Password Was Changed', html);
        
        res.json({ message: 'Password has been safely updated.' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};
