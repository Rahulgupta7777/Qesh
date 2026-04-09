import express from "express";
import { getSlots } from "../controllers/bookingController.js";
import Service from "../models/service.model.js";
import Product from "../models/product.model.js";
import Staff from "../models/staff.model.js";
import Offer from "../models/offer.model.js";
import Category from "../models/category.model.js";

const router = express.Router();

// 1. Get All Services (Active)
router.get("/services", async (req, res) => {
  try {
    const activeCategories = await Category.find({ isActive: true }).select("name");
    const activeCategoryNames = activeCategories.map((cat) => cat.name);
    const services = await Service.find({
      isActive: true,
      category: { $in: activeCategoryNames }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Get Shop Products (Stock > 0)
router.get("/shop", async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Get Available Slots
router.get("/slots", getSlots);

// 4. Get Active Staff
router.get("/staff", async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true, isDeleted: false }); 
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Get Active Offers
router.get("/offers", async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. Get All Categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({isActive: true}).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. Verify Coupon Endpoint
router.post("/verify-coupon", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Code is required" });

    // Finding active offer matching the code 
    const offer = await Offer.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });

    if (!offer) {
      return res.status(404).json({ message: "Invalid or inactive coupon code." });
    }

    // Check Expiry
    if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
      return res.status(400).json({ message: "This coupon has expired." });
    }

    // Return offer details needed for calculation
    return res.json({
      code: offer.code,
      type: offer.type, // "percentage" or "flat"
      value: offer.value,
      title: offer.title
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
