import express from 'express';
import { registerUser, loginUser, logoutUser, generate2FA, verify2FA, disable2FA, forgotPassword, resetPassword } from '../controllers/authController';
import rateLimit from 'express-rate-limit';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { message: 'Too many requests from this IP, please try again after an hour, securely.' }
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Universal 2FA Setup endpoints
router.post('/2fa/generate', protect, generate2FA);
router.post('/2fa/verify', protect, verify2FA);
router.post('/2fa/disable', protect, disable2FA);

router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', forgotPasswordLimiter, resetPassword);

export default router;
