import { getStaffSchedule, getActiveNotices, getMyProfile, updateAppointmentStatus } from "../controllers/staffController.js";
import express from "express";
import { verifyToken, verifyStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken, verifyStaff);

router.get("/schedule", getStaffSchedule);
router.get("/notices", getActiveNotices);
router.get("/profile", getMyProfile);
router.put("/appointments/:id/status", updateAppointmentStatus);

export default router;