const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authLimiter } = require('../middleware');

router.post('/signup', authLimiter, authController.signup);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);

module.exports = router;
