const express = require('express');
const router = express.Router();

const { sendMailToUser, sendMailToAll, verifyOTP, sendOTP } = require("../controllers/sendOtp");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/send-multiple", protect, adminOnly, sendMailToUser);
router.post("/send-all", protect, adminOnly, sendMailToAll);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);


module.exports = router;