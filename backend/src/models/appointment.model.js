import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The Customer
  services: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
      variant: { type: String, enum: ["male", "female"], required: true },
    },
  ],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  date: { type: Date, required: true }, 
  timeSlot: { type: String, required: true }, // Format: "10:00 AM"
  totalAmount: { type: Number, required: true }, // Server-Calculated
  paymentStatus: {type: String, enum: ["pending", "paid", "refunded"], default: "pending"},
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled", "noshow"], default: "pending" },
  staffNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Compound Index to Prevent Double Booking
appointmentSchema.index(
  { date: 1, timeSlot: 1, staff: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $ne: "cancelled" },
      staff: { $ne: null },
    },
  },
);

export default mongoose.model("Appointment", appointmentSchema);
