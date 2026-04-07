import express from "express";
import { sendOtp, verifyOtp, portalLogin, portalLogout } from "../controllers/authController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per hour
  message: {
    message:
      "Too many OTP requests from this IP, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Customer Auth
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtp);

// Admin Auth
router.post("/admin/login", portalLogin);
router.post("/admin/logout", portalLogout);

export default router;
