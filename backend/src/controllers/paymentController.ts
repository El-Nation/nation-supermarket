import { Request, Response } from 'express';
import { pool } from '../config/db';
import axios from 'axios';
import crypto from 'crypto';
import { sendSystemEmail, notifyGlobalAdmin, generateEmailHTML, generateReceiptEmailHTML } from '../utils/mailer';
import { triggerSystemNotification } from '../utils/notificationHelper';

export const createMockOrder = async (req: Request, res: Response) => {
    try {
        const { delivery_type, delivery_zone_id, delivery_address, items, customer, user_id } = req.body;
        
        let subtotal = 0;
        let delivery_fee = 0;

        for(const item of items) {
           const pRes = await pool.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
           subtotal += Number(pRes.rows[0].price) * item.quantity;
        }

        if(delivery_type === 'delivery' && delivery_zone_id) {
           const dRes = await pool.query('SELECT fee FROM delivery_zones WHERE id = $1', [delivery_zone_id]);
           delivery_fee = Number(dRes.rows[0].fee);
        }

        const total_amount = subtotal + delivery_fee;
        const order_reference = 'NS-MOCK-' + Math.floor(Math.random()*1000000);

        const oRes = await pool.query(
            `INSERT INTO orders (order_reference, user_id, guest_data, delivery_type, subtotal, delivery_fee, total_amount, delivery_address) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [order_reference, user_id || null, JSON.stringify(customer), delivery_type, subtotal, delivery_fee, total_amount, delivery_address]
        );
        const order_id = oRes.rows[0].id;

        for(const item of items) {
           const pRes = await pool.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
           await pool.query(
               'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
               [order_id, item.product_id, item.quantity, pRes.rows[0].price]
           );
        }

        const formattedItems = items.map((item: any) => ({
            product_id: item.product_id,
            name: item.name,
            quantity: item.quantity,
            unit_price: Number(item.price),
            item_total: Number(item.price) * item.quantity,
            image: item.image_url || ''
        }));

        const rData = {
            order_reference: order_reference,
            payment_reference: order_reference,
            date: new Date().toISOString(),
            customer: {
                name: customer?.name || "Customer",
                phone: customer?.phone || "",
                email: customer?.email || ""
            },
            items: formattedItems,
            subtotal: Number(subtotal),
            delivery_fee: Number(delivery_fee),
            total_paid: total_amount,
            fulfilment_method: delivery_type,
            delivery_address: delivery_address || '',
            pickup_location: delivery_type === 'store_pickup' ? 'Nation Supermarket HQ Benin' : ''
        };

        await pool.query(
            'INSERT INTO receipts (payment_id, receipt_url, receipt_data) VALUES ($1, $2, $3)',
            [null, `/receipts/${order_reference}`, JSON.stringify(rData)]
        );
        
        const customer_email = customer?.email || 'contact@nationsupermarket.com';
        const receiptHTML = generateReceiptEmailHTML(rData);

        // Send customer full receipt email
        await sendSystemEmail(customer_email, `Your Nation Supermarket Receipt — Order ${order_reference}`, receiptHTML);
        
        // Send admin full receipt copy
        const adminQuery = await pool.query("SELECT email FROM users WHERE role = 'admin' LIMIT 1");
        const adminEmail = adminQuery.rows[0]?.email || process.env.SMTP_USER;
        if (adminEmail) {
            await sendSystemEmail(adminEmail, `New Paid Order — Nation Supermarket — ${order_reference}`, receiptHTML);
        }

        res.json({ order_id, amount: total_amount });
    } catch(e: any) {
        console.error('Failed generating test order sequence:', e);
        res.status(500).json({message: 'Simulation pipeline disrupted. Exact Failure: ' + (e.message || String(e))});
    }
};

export const initializePayment = async (req: Request, res: Response) => {
    try {
        const { order_id, email, amount } = req.body;
        
        const response = await axios.post('https://api.paystack.co/transaction/initialize', {
            email,
            amount: Math.round(Number(amount) * 100),
            metadata: { order_id, customer_email: email },
            callback_url: 'http://localhost:5173/checkout/verify'
        }, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
        });

        res.json(response.data);
    } catch (e: any) {
        console.error('Paystack initialization failure', e.response?.data || e);
        res.status(500).json({ message: 'Error negotiating secure channels with Gateway.' });
    }
};

// Helper for Idempotent Order & Receipt Settlement
async function processOrderSettlement(reference: string, gatewayRef: string, order_id: number, paidAmount: number) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if payment reference is already logged
        const existingPayment = await client.query(
            'SELECT id FROM payments WHERE payment_reference = $1 FOR UPDATE',
            [reference]
        );

        let isFirstTimeProcessing = false;
        let payment_id: number;

        if (existingPayment.rows.length === 0) {
            // First time processing! Record payment atomically.
            const payRes = await client.query(
                `INSERT INTO payments (order_id, payment_reference, amount, payment_status, gateway_reference) 
                 VALUES ($1, $2, $3, 'success', $4) RETURNING id`,
                [order_id, reference, paidAmount, gatewayRef]
            );
            payment_id = payRes.rows[0].id;
            isFirstTimeProcessing = true;

            // Update Order Status
            await client.query(
                `UPDATE orders SET payment_status = 'paid', order_status = 'processing', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
                [order_id]
            );
        } else {
            payment_id = existingPayment.rows[0].id;
        }

        // Fetch order details for building receipt
        const orderData = await client.query(
            `SELECT o.*, u.name as customer_name, u.phone as customer_phone, u.email as customer_email 
             FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = $1`,
            [order_id]
        );
        const o = orderData.rows[0];

        if (!o) {
            await client.query('ROLLBACK');
            throw new Error(`Order ID ${order_id} not found.`);
        }

        // Check if receipt entry exists
        const existingReceipt = await client.query(
            'SELECT id FROM receipts WHERE payment_id = $1 FOR UPDATE',
            [payment_id]
        );

        let receiptJSON: any = null;

        if (existingReceipt.rows.length === 0) {
            const itemsData = await client.query(
                `SELECT i.*, p.name, p.images FROM order_items i JOIN products p ON i.product_id = p.id WHERE i.order_id = $1`,
                [order_id]
            );
            const items = itemsData.rows;

            const storeAddress = await client.query(`SELECT value FROM store_settings WHERE key = 'store_pickup_address'`);
            const physicalStoreString = storeAddress.rows[0]?.value || '16 Ihama Road Boundary, Benin City';

            receiptJSON = {
                order_reference: o.order_reference,
                payment_reference: reference,
                date: new Date().toISOString(),
                customer: {
                    name: o.customer_name || o.guest_data?.name || 'Customer',
                    phone: o.customer_phone || o.guest_data?.phone || '-',
                    email: o.customer_email || o.guest_data?.email || '-'
                },
                fulfilment_method: o.delivery_type,
                delivery_address: o.delivery_type === 'store_pickup' ? undefined : o.delivery_address,
                pickup_location: o.delivery_type === 'store_pickup' ? physicalStoreString : undefined,
                items: items.map((i: any) => {
                    let imgUrl = '';
                    if (Array.isArray(i.images) && i.images.length > 0) {
                        imgUrl = i.images[0];
                    } else if (typeof i.images === 'string') {
                        try {
                            const parsed = JSON.parse(i.images);
                            if (Array.isArray(parsed) && parsed.length > 0) imgUrl = parsed[0];
                            else if (typeof parsed === 'string') imgUrl = parsed;
                        } catch (e) {
                            imgUrl = i.images;
                        }
                    }
                    if (imgUrl && !imgUrl.startsWith('http')) {
                        imgUrl = `https://nationsupermarket.eghedev.com${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
                    }
                    return {
                        name: i.name,
                        quantity: i.quantity,
                        unit_price: Number(i.price),
                        item_total: Number(i.price) * i.quantity,
                        image: imgUrl
                    };
                }),
                subtotal: Number(o.subtotal),
                delivery_fee: o.delivery_type === 'store_pickup' ? 0 : Number(o.delivery_fee),
                total_paid: Number(o.total_amount),
            };

            await client.query(
                `INSERT INTO receipts (payment_id, receipt_url, receipt_data) VALUES ($1, $2, $3)`,
                [payment_id, `/receipts/${reference}`, JSON.stringify(receiptJSON)]
            );
        } else {
            // Retrieve existing receipt data for email fallback if needed
            const rDataRes = await client.query('SELECT receipt_data FROM receipts WHERE payment_id = $1', [payment_id]);
            receiptJSON = rDataRes.rows[0]?.receipt_data;
        }

        await client.query('COMMIT');

        // DISPATCH EMAILS ONLY ON FIRST-TIME PROCESSING
        if (isFirstTimeProcessing && receiptJSON) {
            const customer_email = receiptJSON.customer?.email || 'contact@nationsupermarket.com';
            const receiptHTML = generateReceiptEmailHTML(receiptJSON);

            await triggerSystemNotification(null, 'Payment Settlement Cleared', `Order ${o.order_reference} paid ₦${paidAmount} via Paystack.`);

            // 1. Customer Email
            try {
                await sendSystemEmail(
                    customer_email,
                    `Your Nation Supermarket Receipt — Order ${o.order_reference}`,
                    receiptHTML
                );
            } catch (err) {
                console.error("Failed sending customer receipt email:", err);
            }

            // 2. Admin Email
            try {
                const adminQuery = await pool.query("SELECT email FROM users WHERE role = 'admin' LIMIT 1");
                const adminEmail = adminQuery.rows[0]?.email || process.env.SMTP_USER;
                if (adminEmail) {
                    await sendSystemEmail(
                        adminEmail,
                        `New Paid Order — Nation Supermarket — ${o.order_reference}`,
                        receiptHTML
                    );
                }
            } catch (err) {
                console.error("Failed sending admin receipt email:", err);
            }
        }

        return { success: true, isFirstTimeProcessing, receiptJSON };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        console.log(">>> VERIFY PAYMENT ENDPOINT HIT! Body:", req.body);
        const { reference } = req.body;
        
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
        });

        if (response.data.data.status === 'success') {
            const amount = response.data.data.amount / 100;
            const order_id = response.data.data.metadata?.order_id;
            
            if (!order_id) {
                console.error("Critical failure: Paystack metadata dropped order_id.");
                return res.status(400).json({ message: 'Transaction missing local order reference.' });
            }

            await processOrderSettlement(reference, response.data.data.id.toString(), Number(order_id), amount);

            res.json({ message: 'Payment authenticated and digitally certified.' });
        } else {
            res.status(400).json({ message: 'Transaction unresolved.' });
        }
    } catch (e: any) {
        console.error('Verification sequence failure:', e.response?.data || e.message || e);
        res.status(500).json({ message: 'Internal server error verifying transaction.' });
    }
};

export const paystackWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const secret = process.env.PAYSTACK_SECRET_KEY as string;
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

        if (hash === req.headers['x-paystack-signature']) {
            const event = req.body;
            
            if (event.event === 'charge.success') {
                const { reference, metadata } = event.data;
                const paymentAmount = event.data.amount / 100;
                
                if (metadata && metadata.order_id) {
                    await processOrderSettlement(reference, event.data.id.toString(), Number(metadata.order_id), paymentAmount);
                }
            }
        }
        res.status(200).send();
    } catch(e) {
        console.error('Webhook payload parsing rejected:', e);
        res.status(500).send();
    }
};

