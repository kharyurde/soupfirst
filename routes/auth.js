const authController = require('../controllers/authController');
const router = require('express').Router();

router.post("/register", authController.createUser);

router.post("/login", authController.loginUser);

router.post("/resend-otp", authController.resendOtp);

module.exports = router;