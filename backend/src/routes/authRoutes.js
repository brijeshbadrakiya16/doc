const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateBody } = require('../middleware/validateRequest');
const { signupSchema, loginSchema } = require('../utils/validators');

router.post('/signup', authLimiter, validateBody(signupSchema), authController.signup);
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);
router.get('/me', protect, authController.getCurrentUser);
router.post('/logout', protect, authController.logout);

module.exports = router;
