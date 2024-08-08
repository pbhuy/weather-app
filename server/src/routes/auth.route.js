const express = require('express');

const { authController } = require('../controllers');

const router = express.Router();

router.post('/send-verification-email', authController.sendVerificationEmail);
router.post('/verify-email', authController.verifyEmail);

module.exports = router;
