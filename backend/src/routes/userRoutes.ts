import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { updateCustomerProfile, changeCustomerPassword, getCustomerProfileSecure } from '../controllers/userController';
import { getCustomerOrders } from '../controllers/orderController';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { addReview } from '../controllers/reviewController';

const router = express.Router();

// Strict global protection for customer routes
router.use(protect);

router.post('/profile', updateCustomerProfile);
router.get('/profile-secure', getCustomerProfileSecure);
router.post('/password', changeCustomerPassword);
router.get('/orders', getCustomerOrders);

router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:product_id', removeFromWishlist);

router.post('/products/:productId/reviews', addReview);

export default router;
