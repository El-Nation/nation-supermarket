import express from 'express';
import { registerUser, loginUser, logoutUser, generate2FA, verify2FA, disable2FA } from '../controllers/authController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Universal 2FA Setup endpoints
router.post('/2fa/generate', protect, generate2FA);
router.post('/2fa/verify', protect, verify2FA);
router.post('/2fa/disable', protect, disable2FA);

export default router;
