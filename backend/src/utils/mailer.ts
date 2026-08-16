import nodemailer from 'nodemailer';
import { pool } from '../config/db';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
    },
});

export const sendSystemEmail = async (to: string, subject: string, html: string) => {
    try {
        if (!process.env.SMTP_USER) {
            console.warn(`[SMTP DISABLED] Email securely mocked: To: ${to} | Subject: ${subject}`);
            return true;
        }

        await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Nation Supermarket" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`[SMTP] Successfully dispatched email generically stably to: ${to}`);
        return true;
    } catch(e) {
        console.error(`[SMTP ERROR] Exception caught generic dispatcher:`, e);
        return false;
    }
};

export const notifyGlobalAdmin = async (subject: string, html: string) => {
    try {
        const adminQuery = await pool.query("SELECT email FROM users WHERE role = 'admin' LIMIT 1");
        const adminEmail = adminQuery.rows[0]?.email || process.env.SMTP_USER;
        if(adminEmail) {
            await sendSystemEmail(adminEmail, subject, html);
        }
    } catch(e) {}
};

export const sendPasswordChange = async (email: string) => {
    return sendSystemEmail(email, 'Security Alert: Password Changed', '<p>Your administrative password was recently officially changed.</p>');
};

export const sendPhoneChange = async (email: string) => {
    return sendSystemEmail(email, 'Security Alert: Phone Number Changed', '<p>Your secure account phone identity was successfully updated natively.</p>');
};

export const sendEmailChangeWarning = async (oldEmail: string) => {
    return sendSystemEmail(oldEmail, 'Security Alert: Expected Email Pivot', '<p>A structural request to migrate your local operational address was approved.</p>');
};

export const sendEmailChangeConfirmation = async (newEmail: string) => {
    return sendSystemEmail(newEmail, 'Security Alert: Email Bound', '<p>This structural identifier has flawlessly bound officially to your local generic administrator profile securely natively.</p>');
};

export const send2FAToggle = async (email: string, isEnabled: boolean) => {
    return sendSystemEmail(
        email, 
        'Security Alert: Two-Factor Authentication Changed', 
        `<p>Your account's Two-Factor Authentication (2FA) is now officially <strong>${isEnabled ? 'Enabled' : 'Disabled'}</strong>.</p><p>If you did not make this change, please contact support immediately.</p>`
    );
};

export const sendResetEmail = async (email: string, token: string) => {
    return sendSystemEmail(
        email, 
        'Reset your Nation Supermarket password',
        `<div style="font-family: sans-serif; color: #1e293b;">
            <p>You requested a password reset. Click the link below to set a new password:</p>
            <p><a href="https://nationsupermarket.eghedev.com/reset-password?token=${token}" style="color: #0d9488; font-weight: bold;">Reset Password</a></p>
            <p>This link expires in 60 minutes.</p>
            <p>If you didn't request this, ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 2rem;"/>
            <p style="font-size: 0.8rem; color: #64748b;">© 2026 Nation Supermarket. All rights reserved.</p>
        </div>`
    );
};

