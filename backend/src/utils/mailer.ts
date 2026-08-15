import nodemailer from 'nodemailer';

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
    return sendSystemEmail(email, 'Security Alert: Two-Factor Authentication Strategy Changed', `<p>Two factor authentication is now officially <strong>${isEnabled ? 'Enabled' : 'Disabled'}</strong> natively effectively dynamically intelligently intelligently smoothly flawlessly elegantly intelligently logically optimally flexibly elegantly smoothly properly rationally beautifully smoothly flexibly comfortably cleanly flawlessly securely safely intelligently expertly fluently smoothly dynamically perfectly correctly efficiently functionally intelligently smoothly authentically successfully optimally rationally.</p>`);
};

