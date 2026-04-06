import express from "express";
import { verifyToken, verifyAdmin} from "../middleware/authMiddleware.js";
import {
  createService,
  updateService,
  deleteService,
  getAllServices,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  createStaff,
  getStaff,
  editStaff,
  deleteStaff,
  getStaffSchedule,
  blockSlot,
  unblockSlot,
  getDashboardStats,
  createBooking,
  editBooking,
  cancelBooking,
  getAllBookings,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  deletePermanentCategory,
  promoteUser,
  demoteUser,
  searchImages,
  updateProfile,
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
  getAllOffers,
  createOffer,
  deleteOffer,
  updateOffer,
  getAllUsers
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all routes
router.use(verifyToken, verifyAdmin);

// Dashboard
router.get("/stats", getDashboardStats);

// Bookings(Admin control)
router.get("/bookings", getAllBookings);
router.post("/bookings", createBooking); // Walk-in / Override
router.patch("/bookings/:id", editBooking); // Reschedule / Reassign
router.patch("/bookings/:id/cancel", cancelBooking); // Admin Cancellation

// Services
router.get("/services", getAllServices);
router.post("/services", createService);
router.patch("/services/:id", updateService);
router.delete("/services/:id", deleteService); // Soft Delete

// Products
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct); // Soft Delete
router.get("/products", getAllProducts);

// Staff
router.post("/staff", createStaff);
router.get("/staff", getStaff);
router.patch("/staff/:id", editStaff); 
router.delete("/staff/:id", deleteStaff); // Soft Delete
router.get("/staff/:id/schedule", getStaffSchedule);

// Blocked Slots
router.post("/blocked-slots", blockSlot);
router.delete("/blocked-slots/:id", unblockSlot);

// Offers
router.get("/offers", getAllOffers);
router.post("/offers", createOffer);
router.delete("/offers/:id", deleteOffer);
router.patch("/offers/:id", updateOffer);

// Categories
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.delete("/categories/:id/permanent", deletePermanentCategory); 

//user role management
router.post("/promote-user", promoteUser);
router.post("/demote-user", demoteUser);

// Admin Profile
router.patch("/profile", updateProfile); // Admin Profile Update

// Image Search Proxy (Pixabay)
router.get("/search-images", searchImages);

// Notices
router.post("/notices", createNotice);
router.get("/notices", getAllNotices);
router.patch("/notices/:id", updateNotice);
router.delete("/notices/:id", deleteNotice);

//all users (for admin purposes)
router.get("/users", getAllUsers);

export default router;
