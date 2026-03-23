import Appointment from "../models/appointment.model.js";
import BlockedSlot from "../models/blockedSlot.model.js";
import Service from "../models/service.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Staff from "../models/staff.model.js";
import { sendWhatsappOtp } from "../utils/WhatsApp.js"; // We might need a separate template for confirmation
import mongoose from "mongoose";
import Offer from "../models/offer.model.js";

// Helper: Get Time Slots (10 AM - 8 PM)
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 10;
  const endHour = 20; // 8 PM
  for (let i = startHour; i < endHour; i++) {
    const hour = i === 12 ? 12 : i % 12;
    const ampm = i < 12 ? "AM" : "PM";
    slots.push(`${hour}:00 ${ampm}`);
    slots.push(`${hour}:30 ${ampm}`);
  }
  return slots;
};

export const getSlots = async (req, res) => {
  let { date, staffId, serviceIds } = req.query; // serviceIds is comma-separated string, remember
  if (!date)
    return res.status(400).json({ message: "Date and Services required" });

  try {
    // Calculate Total Duration
    let totalDuration = 0;

    if (serviceIds && serviceIds.trim() !== "") {
        const services = await Service.find({
          _id: { $in: serviceIds.split(",") },
        });
        totalDuration = services.reduce(
          (acc, s) => acc + (s.duration || 30),
          0,
        );
    }

    if (totalDuration === 0) totalDuration = 30;

    const slotsNeeded = Math.ceil(totalDuration / 30);

    const allSlots = generateTimeSlots();

    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "cancelled" },
    });

    let eligibleStaff = [];
    if (staffId) {
      eligibleStaff = [staffId];
    } else {
      const staffMembers = await Staff.find({ isDeleted: false,isActive: true });
      eligibleStaff = staffMembers.map((s) => s._id.toString());
    }

    const availableSlots = [];

    for (let i = 0; i <= allSlots.length - slotsNeeded; i++) {
      const timeChunk = allSlots.slice(i, i + slotsNeeded); // e.g., ["10:00", "10:30"]

      // Check if AT LEAST ONE staff member is free for the ENTIRE chunk
      const hasFreeStaff = eligibleStaff.some((sId) => {
        // Check if this specific staff member is busy in ANY of the required slots
        const isBusy = appointments.some(
          (appt) =>
            appt.staff.toString() === sId && timeChunk.includes(appt.timeSlot),
        );
        return !isBusy;
      });

      if (hasFreeStaff) {
        availableSlots.push(allSlots[i]);
      }
    }
    res.json({ date, slots: availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Booking
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let { date, timeSlot, services, products, staffId, couponCode } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const activeUserBooking = await Appointment.findOne({
      userId: userId,
      date: { $gte: startOfToday }, // Future or Today
      status: { $in: ["confirmed", "booked", "pending"] } // Active Statuses
    });

    if (activeUserBooking) {
      return res.status(409).json({ 
        message: "You already have an upcoming appointment. Please complete it before booking a new one." 
      });
    }

    if (!staffId) {
      // Find a staff member who is active AND free at this time
      const activeStaff = await Staff.find({ isDeleted: false,isActive: true });

      // Get all bookings at this time
      const busyStaffIds = await Appointment.find({
        date: new Date(date),
        timeSlot: timeSlot,
        status: { $ne: "cancelled" },
      }).distinct("staff"); // Get list of busy staff IDs

      // Finding someone who is NOT in the busy list
      const availableStaff = activeStaff.find((s) => !busyStaffIds.map((id) => id.toString()).includes(s._id.toString()));

      if (!availableStaff) {
        return res
          .status(409)
          .json({ message: "No staff available at this time." });
      }

      staffId = availableStaff._id;
    }
    // Checking if slot still free or not.
    const existing = await Appointment.findOne({
      date: new Date(date),
      timeSlot,
      status: { $nin: ["cancelled", "noshow"] },
    });
    if (existing) {
      return res.status(409).json({
        message: "Slot already booked/Unavailable. Please choose another.",
      });
    }

    const blocked = await BlockedSlot.findOne({
      date: new Date(date),
      timeSlot,
    });
    if (blocked) {
      return res.status(409).json({
        message: "Slot already booked/Unavailable. Please choose another.",
      });
    }

    let totalAmount = 0;

    const hasGeneralMembership = user.subscriptions && user.subscriptions.some(
      (sub) => sub.name === "Salon Membership" && sub.isActive && new Date(sub.expiry) > new Date()
    );

    // Process Services
    if (Array.isArray(services) && services.length > 0) {
      for (const item of services) {
        const service = await Service.findOne({ _id: item.serviceId, isActive: true });
        if (!service) throw new Error(`Service not available: ${item.serviceId}`);

        let price = item.variant === "male" ? service.prices.male : service.prices.female; 

        // CHECK SUBSCRIPTIONS
        const hasSpecificSub = user.subscriptions && user.subscriptions.some(
          (sub) => sub.isActive && 
                   new Date(sub.expiry) > new Date() && 
                   service.name.toLowerCase() === sub.name.toLowerCase() 
        );

        if (hasSpecificSub) {
          price = 0; // Free if covered by specific subscription
        } else if (hasGeneralMembership) {
          price = price * 0.80; // Apply 20% discount 
        }

        totalAmount += price;
      }
    }

    if (products && products.length > 0) {
      for (const prodId of products) {
        const product = await Product.findOne({ _id: prodId, isActive: true });
        if (!product) throw new Error(`Product not available: ${prodId}`);
        
        totalAmount += product.price;
        await Product.findByIdAndUpdate(prodId, { $inc: { stock: -1 } }, { session });
      }
    }

    if (couponCode) {
      const offer = await Offer.findOne({ code: couponCode.toUpperCase(), isActive: true });
      
      // Validate Expiry
      if (offer) {
        const isExpired = offer.expiryDate && new Date(offer.expiryDate) < new Date();
        
        if (!isExpired) {
          let discountAmount = 0;
          if (offer.type === "percentage") {
            discountAmount = (totalAmount * offer.value) / 100;
          } else {
            discountAmount = offer.value;
          }
          // Apply discount (also ensuring total doesn't go below 0)
          totalAmount = Math.max(0, totalAmount - discountAmount);
        }
      }
    }

    
    // let totalAmount = 0;

    // if (Array.isArray(services) && services.length > 0) {
    //   for (const item of services) {
    //     const service = await Service.findOne({
    //       _id: item.serviceId,
    //       isActive: true,
    //     });
    //     if (!service) throw new Error(`Service not available: ${item.serviceId}`);

    //     totalAmount +=
    //       item.variant === "male" ? service.prices.male : service.prices.female;
    //   }
    // }

    // // Products
    // if (products && products.length > 0) {
    //   for (const prodId of products) {
    //     const product = await Product.findOne({ _id: prodId, isActive: true });
    //     if (!product) throw new Error(`Product not available: ${prodId}`);
    //     totalAmount += product.price;

    //     await Product.findByIdAndUpdate(
    //       prodId,
    //       { $inc: { stock: -1 } },
    //       { session },
    //     );
    //   }
    // }

    const appointment = await Appointment.create(
      [
        {
          userId: userId,
          date: new Date(date),
          timeSlot,
          services,
          products,
          staff: staffId,
          totalAmount: Math.round(totalAmount), // Round to avoid decimals
          status: "confirmed",
        },
      ],
      { session },
    );

    try {
      const user = await User.findById(userId);
      if (user) {
        // TODO: Create a separate 'booking_confirmed' template function in WhatsApp.js
        // await sendWhatsappConfirmation(user.phone, date, timeSlot);
      }
    } catch (notifyError) {
      console.error(
        "Notification Failed (Booking still successful):",
        notifyError.message,
      );
    }
    await session.commitTransaction();
    return res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error("Booking Error:", error);
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    await session.endSession();
  }
};
// 3. Get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
      .populate("services.serviceId")
      .populate("products")
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Cancel Booking
export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify ownership
    if (appointment.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    // Check if already cancelled or completed
    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }
    if (appointment.status === "completed") {
      return res
        .status(400)
        .json({ message: "Cannot cancel a completed booking" });
    }

    // Update status
    appointment.status = "cancelled";
    await appointment.save();

    // Increase product stock back if products were purchased.
    if (appointment.products && appointment.products.length > 0) {
      for (const prodId of appointment.products) {
        await Product.findByIdAndUpdate(prodId, { $inc: { stock: 1 } });
      }
    }

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (error) {
    console.error("Cancellation Error:", error);
    res.status(500).json({ message: error.message });
  }
};
