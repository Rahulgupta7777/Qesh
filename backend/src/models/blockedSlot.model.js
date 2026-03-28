import mongoose from "mongoose";

const blockedSlotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // "10:00 AM" or "ALL"
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
    reason: { type: String }, // e.g., "Holiday", "Staff Lunch"
  },
  { timestamps: true },
);

export default mongoose.model("BlockedSlot", blockedSlotSchema);
