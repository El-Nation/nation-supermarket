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

export const generateEmailHTML = (title: string, contentHTML: string, cta?: { text: string; url: string }) => {
    const ctaHTML = cta ? `
        <div style="margin-top: 30px; margin-bottom: 10px;">
            <a href="${cta.url}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                ${cta.text}
            </a>
        </div>
    ` : '';

    return `
    <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 1.6; color: #334155;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            
            <div style="background-color: #0f172a; padding: 25px 30px; text-align: center;">
                <img src="https://nationsupermarket.eghedev.com/logo.png" alt="Nation Supermarket Core" style="height: 48px; width: auto; object-fit: contain; margin: 0 auto; display: block;" />
            </div>

            <div style="padding: 40px 30px;">
                <h2 style="margin-top: 0; color: #0f172a; font-size: 22px; font-weight: 700;">${title}</h2>
                <div style="margin-top: 20px; font-size: 16px; color: #475569;">
                    ${contentHTML}
                </div>
                ${ctaHTML}
            </div>

            <div style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                    © 2026 Nation Supermarket. All rights reserved.
                </p>
                <p style="margin: 8px 0 0; font-size: 12px; color: #cbd5e1;">
                    This is an automated structural notification matrix. Please do not reply linearly.
                </p>
            </div>
        </div>
    </div>
    `;
};

export const notifyGlobalAdmin = async (subject: string, htmlContent: string) => {
    try {
        const adminQuery = await pool.query("SELECT email FROM users WHERE role = 'admin' LIMIT 1");
        const adminEmail = adminQuery.rows[0]?.email || process.env.SMTP_USER;
        if(adminEmail) {
            const finalHTML = generateEmailHTML(subject, htmlContent);
            await sendSystemEmail(adminEmail, subject, finalHTML);
        }
    } catch(e) {}
};

export const sendPasswordChange = async (email: string) => {
    const html = generateEmailHTML(
        'Password Security Concurrency Updated',
        '<p>Your password was successfully changed.</p><p>This email is a mandatory security notification mapping explicitly to let you know that your account credentials were recently officially updated.</p><p>If you did not execute this structural reset, please contact support generically immediately.</p>'
    );
    return sendSystemEmail(email, 'Your Nation Supermarket password was changed', html);
};

export const sendPhoneChange = async (email: string) => {
    const html = generateEmailHTML(
        'Phone Identifier Changed',
        '<p>Your primary cellular contact number mapped to this account was successfully updated flawlessly.</p><p>This email acts as a strict security proxy notifying you that identity credentials were modified natively.</p>'
    );
    return sendSystemEmail(email, 'Your Nation Supermarket Phone Number Was Changed', html);
};

export const sendEmailChangeWarning = async (oldEmail: string) => {
    const html = generateEmailHTML(
        'Primary Identity Alteration Detected',
        '<p>A structural request to migrate your operational email address to a new identity wrapper was executed.</p><p>If you did not authorize this explicit action, please contact our administrative center dynamically automatically.</p>'
    );
    return sendSystemEmail(oldEmail, 'Urgent: Your Nation Supermarket Email Profile Was Modified', html);
};

export const sendEmailChangeConfirmation = async (newEmail: string) => {
    const html = generateEmailHTML(
        'Welcome To Your New Dashboard Identifier',
        '<p>This email identifier has flawlessly bound officially to your local user profile safely natively.</p><p>You can now utilize this address selectively to log gracefully into the platform conceptually.</p>'
    );
    return sendSystemEmail(newEmail, 'Your Target Email Was Changed Successfully', html);
};

export const send2FAToggle = async (email: string, isEnabled: boolean) => {
    const action = isEnabled ? 'Enabled' : 'Disabled';
    const html = generateEmailHTML(
        `2FA Array ${action}`,
        `<p>Your account's secure Multi-Factor Authentication (2FA) is now safely <strong>${action}</strong>.</p><p>This change has taken immediate global effect on your authentication wrapper.</p>`
    );
    return sendSystemEmail(email, `Your Nation Supermarket 2FA Constraints Were ${action}`, html);
};

export const sendResetEmail = async (email: string, token: string) => {
    const html = generateEmailHTML(
        'Reset Your Account Password Array',
        '<p>We received an external proxy request to explicitly reset the password wrapper mapped seamlessly for your generic Nation Supermarket base account.</p><p>If you safely made this request, dynamically click the button structurally below to intelligently inject a new password dynamically.</p><p style="color: #64748b; font-size: 14px; margin-top:20px;">If you did not intentionally request a password reset automatically natively, you can safely ignore this automated message.</p>',
        { text: 'Reset Password', url: `https://nationsupermarket.eghedev.com/reset-password?token=${token}` }
    );
    return sendSystemEmail(email, 'Reset Your Nation Supermarket Password', html);
};

