import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware';
import { uploadMedia } from '../middlewares/uploadMiddleware';
import { 
    createProduct, getProducts, deleteProduct, updateProductStock, updateProduct,
    createCategory, getCategories, updateCategory 
} from '../controllers/inventoryController';
import { getDeliveryZones, createDeliveryZone, updateDeliveryZone, deleteDeliveryZone } from '../controllers/deliveryController';
import { getStoreSettings, updateStoreSetting } from '../controllers/storeSettingsController';
import { getDashboardAnalytics } from '../controllers/adminController';
import { getAllReceipts } from '../controllers/receiptController';
import { initializePayment, verifyPayment, createMockOrder } from '../controllers/paymentController';
import { getAllOrders } from '../controllers/orderController';
import { getAllUsers, updateAdminProfile, getAdminProfile } from '../controllers/userController';
import { getAllPayments, getEnquiries, getNotifications, markNotificationRead } from '../controllers/miscAdminController';
import { replyEnquiry } from '../controllers/enquiryController';
import { getAdminReviews, approveStoreFeedback, deleteProductReview, deleteStoreFeedback } from '../controllers/adminReviewController';

const router = express.Router();

// Apply auth protection and admin restriction strictly on this entire router branch
router.use(protect);
router.use(admin);

// Inventory routes
router.post('/products', uploadMedia.array('images', 5), createProduct);
router.get('/products', getProducts);
router.put('/products/:id/full', uploadMedia.array('images', 5), updateProduct);
router.put('/products/:id', updateProductStock);
router.delete('/products/:id', deleteProduct);

// Category routes
router.post('/categories', createCategory);
router.get('/categories', getCategories);
router.put('/categories/:id', updateCategory);

// Delivery Configuration Routes
router.get('/delivery', getDeliveryZones);
router.post('/delivery', createDeliveryZone);
router.put('/delivery/:id', updateDeliveryZone);
router.delete('/delivery/:id', deleteDeliveryZone);

// Settings Configuration Routes
router.get('/settings', getStoreSettings);
router.post('/settings', updateStoreSetting);

// Core Operational Analytics
router.get('/dashboard-analytics', getDashboardAnalytics);

// Complete Orders Array
router.get('/orders', getAllOrders);

// Digital Receipts Vault
router.get('/receipts', getAllReceipts);

// Users CRM
router.get('/users', getAllUsers);
router.get('/profile', getAdminProfile);
router.post('/profile', uploadMedia.single('avatar'), updateAdminProfile);

// Stage 4 Matrix Fulfillment routes
router.get('/payments', getAllPayments);
router.get('/enquiries', getEnquiries);
router.put('/enquiries/:id/reply', replyEnquiry);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

// Reviews & Feedback
router.get('/reviews', getAdminReviews);
router.put('/feedbacks/:id/approve', approveStoreFeedback);
router.delete('/reviews/product/:id', deleteProductReview);
router.delete('/reviews/feedbacks/:id', deleteStoreFeedback);

// Payments Checkouts (Public scope but bundled here for simplicity during Stage 4 Checkout simulation)
router.post('/payments/mock-order', createMockOrder);
router.post('/payments/initialize', initializePayment);
router.post('/payments/verify', verifyPayment);

export default router;
