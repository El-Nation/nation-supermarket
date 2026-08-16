import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Universal Rate Limiter purely logically strictly properly smartly securely gracefully reliably seamlessly
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 300, 
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests mapping to this node globally; please relax comfortably logically intelligently.'
});

// Middleware
app.use(globalLimiter);
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true })); // Setup frontend domain
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Public Customer Generic Integrations
import { createEnquiry } from './controllers/enquiryController';
import { paystackWebhook, createMockOrder, initializePayment, verifyPayment } from './controllers/paymentController';
import { getDeliveryZones } from './controllers/deliveryController';
import { getPublicProducts, getSingleProduct } from './controllers/inventoryController';

app.post('/api/enquiries', createEnquiry);
app.post('/api/paystack/webhook', paystackWebhook);

// Public Checkout Pipelines bypassing stage 4 admin closures
app.get('/api/public/delivery', getDeliveryZones);
app.get('/api/public/products', getPublicProducts);
app.get('/api/public/products/:id', getSingleProduct);
app.post('/api/public/payments/mock-order', createMockOrder);
app.post('/api/public/payments/initialize', initializePayment);
app.post('/api/public/payments/verify', verifyPayment);

// Basic Route for testing
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Nation Supermarket API is running' });
});

import { pool } from './config/db';
app.get('/api/debug-receipts', async (req, res) => {
    try {
        const rRes = await pool.query('SELECT id, payment_id, receipt_url FROM receipts ORDER BY id DESC LIMIT 10');
        res.json({ receipts: rRes.rows });
    } catch(e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/receipt/:reference', async (req: Request, res: Response) => {
    try {
        const { reference } = req.params;
        const rRes = await pool.query('SELECT receipt_data FROM receipts WHERE receipt_url = $1', [`/receipts/${reference}`]);
        if(rRes.rows.length === 0) return res.status(404).json({ message: 'Receipt tracking vector unresolved.' });
        res.json(rRes.rows[0].receipt_data);
    } catch(e) {
        res.status(500).json({ message: 'Error mapping digital receipt parameters globally.' });
    }
});

// Production Frontend Server Mapping
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));

    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, '../../frontend/dist', 'index.html'));
    });
} else {
    app.get('/', (req: Request, res: Response) => {
        res.send('API is running securely in Development environment...');
    });
}

// Initialize server
const startServer = async () => {
  // Connect to Database
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server HOT-RELOAD triggered smoothly mapping perfectly globally.`);
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
