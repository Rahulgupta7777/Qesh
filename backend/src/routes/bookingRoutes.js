import express from "express";
import {
  createBooking,
  getUserBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected: User must be logged in to book
router.post("/create", verifyToken, createBooking);
router.get("/", verifyToken, getUserBookings);
router.put("/:id/cancel", verifyToken, cancelBooking);

export default router;
