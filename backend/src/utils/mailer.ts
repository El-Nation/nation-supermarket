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

export const generateEmailHTML = (title: string, contentHTML: string, cta?: { text: string; url: string }, username?: string) => {
    const ctaHTML = cta ? `
        <div style="margin-top: 25px; margin-bottom: 5px;">
            <a href="${cta.url}" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                ${cta.text}
            </a>
        </div>
    ` : '';

    const greeting = username ? `<p style="margin-top: 0; margin-bottom: 15px;">Hi <strong>${username}</strong>,</p>` : '';

    return `
    <div style="background-color: #ffffff; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #eef2ff; border-radius: 12px; padding: 30px;">
            
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                <tr>
                    <td width="48" style="vertical-align: middle;">
                        <div style="width: 40px; height: 40px; background-color: #ffffff; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                            <img src="https://nationsupermarket.eghedev.com/logo.png" alt="Logo" style="width: 100%; height: auto; object-fit: contain;" />
                        </div>
                    </td>
                    <td style="vertical-align: middle; padding-left: 10px;">
                        <span style="font-size: 20px; font-weight: 700; color: #7c3aed; margin: 0; display: inline-block;">Nation Supermarket</span>
                    </td>
                </tr>
            </table>

            <div style="font-size: 16px; color: #334155;">
                ${greeting}
                <div style="margin-bottom: 12px; font-weight: 600; font-size: 17px; color: #1e293b;">${title}</div>
                ${contentHTML}
            </div>
            
            ${ctaHTML}
        </div>
        
        <div style="max-width: 600px; margin: 20px auto 0; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                © 2026 Nation Supermarket. All rights reserved.
            </p>
        </div>
    </div>
    `;
};

export const generateReceiptEmailHTML = (receipt: any) => {
    const isPickup = receipt.fulfilment_method === 'store_pickup';
    const formattedDate = receipt.date ? new Date(receipt.date).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    }).replace(',', '') : '';

    const itemsRows = (receipt.items || []).map((item: any) => `
        <tr style="border-bottom: 1px dashed #e2e8f0;">
            <td style="padding: 10px 0; vertical-align: middle;">
                <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td width="40" style="vertical-align: middle;">
                            ${item.image ? `<img src="${item.image}" alt="${item.name}" width="36" height="36" style="border-radius: 4px; object-fit: cover; display: block;" />` : `<div style="width:36px; height:36px; background:#e2e8f0; border-radius:4px; text-align:center; line-height:36px; font-size:10px; color:#94a3b8;">IMG</div>`}
                        </td>
                        <td style="padding-left: 10px; vertical-align: middle;">
                            <div style="font-weight: 600; font-size: 14px; color: #334155;">${item.name}</div>
                            <div style="font-size: 12px; color: #64748b;">Qty: ${item.quantity} &times; &#8358;${Number(item.unit_price).toLocaleString()}</div>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="padding: 10px 0; text-align: right; font-weight: 700; font-size: 14px; color: #1e293b; vertical-align: middle;">
                &#8358;${Number(item.item_total).toLocaleString()}
            </td>
        </tr>
    `).join('');

    return `
    <div style="background-color: #f5f5f5; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1e293b;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <!-- Brand Header -->
            <div style="text-align: center; margin-bottom: 15px;">
                <img src="https://nationsupermarket.eghedev.com/logo.png" alt="Nation Supermarket" width="120" style="margin-bottom: 8px; display: inline-block;" />
                <h1 style="color: #ef4444; margin: 0; font-size: 20px; letter-spacing: 1px; font-weight: 800;">NATION SUPERMARKET</h1>
                <p style="margin: 3px 0 0 0; color: #334155; font-size: 14px; font-weight: 600;">Official Digital Receipt</p>
                <p style="margin: 2px 0 0 0; color: #94a3b8; font-size: 12px;">${isPickup ? (receipt.pickup_location || 'Store Pickup') : 'Online Delivery Ecosystem'}</p>
            </div>

            <div style="border-bottom: 1px dashed #cbd5e1; margin: 15px 0;"></div>

            <!-- Metadata Table -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; margin-bottom: 15px;">
                <tr>
                    <td style="padding: 3px 0; color: #475569;">Order Reference:</td>
                    <td style="padding: 3px 0; text-align: right; color: #ef4444; font-weight: 700; letter-spacing: 0.5px;">${receipt.order_reference}</td>
                </tr>
                ${receipt.payment_reference ? `
                <tr>
                    <td style="padding: 3px 0; color: #475569;">Payment Ref:</td>
                    <td style="padding: 3px 0; text-align: right; color: #334155; font-size: 12px;">${receipt.payment_reference}</td>
                </tr>` : ''}
                <tr>
                    <td style="padding: 3px 0; color: #475569;">Date &amp; Time:</td>
                    <td style="padding: 3px 0; text-align: right; color: #334155;">${formattedDate}</td>
                </tr>
                <tr>
                    <td style="padding: 3px 0; color: #475569;">Customer:</td>
                    <td style="padding: 3px 0; text-align: right; color: #334155; font-weight: 600;">${receipt.customer?.name || 'Customer'}</td>
                </tr>
                <tr>
                    <td style="padding: 3px 0; color: #475569;">Phone:</td>
                    <td style="padding: 3px 0; text-align: right; color: #ef4444;">${receipt.customer?.phone || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 3px 0; color: #475569;">Email:</td>
                    <td style="padding: 3px 0; text-align: right; color: #334155;">${receipt.customer?.email || '-'}</td>
                </tr>
            </table>

            <!-- Items Purchased Table -->
            <div style="background-color: #f8fafc; padding: 12px 15px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 13px; font-weight: 800; letter-spacing: 0.5px;">ITEMS PURCHASED</h3>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${itemsRows}
                </table>

                <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 10px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
                        <tr>
                            <td style="padding: 2px 0; color: #64748b;">Subtotal</td>
                            <td style="padding: 2px 0; text-align: right; color: #334155; font-weight: 600;">&#8358;${Number(receipt.subtotal).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 2px 0; color: #64748b;">Delivery Fee</td>
                            <td style="padding: 2px 0; text-align: right; color: ${isPickup ? '#10b981' : '#334155'}; font-weight: ${isPickup ? '700' : '600'};">
                                ${isPickup ? 'FREE (Pickup)' : `&#8358;${Number(receipt.delivery_fee).toLocaleString()}`}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0 0 0; font-size: 15px; font-weight: 800; color: #1e293b;">Total Paid</td>
                            <td style="padding: 8px 0 0 0; text-align: right; font-size: 16px; font-weight: 800; color: #ef4444;">&#8358;${Number(receipt.total_paid).toLocaleString()}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Fulfilment Info -->
            <div style="margin-bottom: 15px; background-color: #f8fafc; padding: 12px 15px; border-radius: 8px;">
                <h3 style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase;">${isPickup ? 'PICKUP LOCATION' : 'DELIVERY ADDRESS'}</h3>
                <p style="margin: 0; color: #334155; font-size: 13px; line-height: 1.4;">
                    ${isPickup ? `Store Pickup &ndash; ${receipt.pickup_location || '16 Ihama Road Boundary, Benin City'}` : (receipt.delivery_address || 'Delivery Address Provided')}
                </p>
            </div>

            <div style="border-bottom: 1px dashed #cbd5e1; margin: 15px 0;"></div>

            <!-- Footer Badge -->
            <div style="text-align: center;">
                <p style="margin: 0; color: #10b981; font-size: 12px; font-weight: 700;">&#10003; Payment Verified via Paystack</p>
                <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 11px;">NATION SUPERMARKET &copy; 2026</p>
            </div>
        </div>

        <div style="max-width: 500px; margin: 15px auto 0; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2026 Nation Supermarket. All rights reserved.
            </p>
        </div>
    </div>
    `;
};

export const notifyGlobalAdmin = async (subject: string, htmlContent: string) => {
    try {
        const adminQuery = await pool.query("SELECT email FROM users WHERE role = 'admin' LIMIT 1");
        const adminEmail = adminQuery.rows[0]?.email || process.env.SMTP_USER;
        if(adminEmail) {
            const finalHTML = generateEmailHTML(subject, htmlContent, undefined, 'Admin');
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

