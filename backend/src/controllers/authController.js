import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendWhatsappOtp } from "../utils/WhatsApp.js";

// Generate Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Send OTP (Customer)
export const sendOtp = async (req, res) => {
  const { phone } = req.body;
  try {
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    await Otp.findOneAndUpdate(
      { phone },
      { code: otpCode, createdAt: Date.now() },
      { upsert: true }, 
    );

    // Trigger WhatsApp API
    await sendWhatsappOtp(phone, otpCode);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  });
};

// Verify OTP & Login (Customer)
export const verifyOtp = async (req, res) => {
  const { phone, otp, name } = req.body;
  try {
    const validOtp = await Otp.findOne({ phone, code: otp });
    if (!validOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired OTP" });
    }

    // Check if User exists, else create
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, name, role: "user" });
    } else if (name) {
      // Let's update `name` if user doesn't have one, or maybe even if they do (to correct typo).
      user.name = name;
      await user.save();
    }

    const token = generateToken(user);

    // Clean up OTP
    await Otp.deleteOne({ _id: validOtp._id });

    setTokenCookie(res, token);

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const setTokenCookie = (res, token) => {
//   const isProduction = process.env.NODE_ENV === "production";

//   res.cookie("token", token, {
//     httpOnly: true, 
//     secure: isProduction, 
//     sameSite: isProduction ? "none" : "lax", 
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
//   });
// };

// Admin/Staff Login (Email/Pass)
export const portalLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate("staffProfile");

    // Check Email & Role
    if (!user || !["admin", "staff"].includes(user.role)) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    if (user.role === "staff" && user.staffProfile) {
      if (user.staffProfile.isDeleted) {
        return res.status(403).json({ message: "Your account has been deactivated. Contact Admin." });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);

    setTokenCookie(res, token);
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        staffProfile: user.staffProfile, // Frontend needs this to show "My Schedule" for staffs.
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const portalLogout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

