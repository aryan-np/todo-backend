const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth');
const authMiddleware = require('../Middlewares/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authMiddleware,authController.logout); // Client should handle token removal

module.exports = router;