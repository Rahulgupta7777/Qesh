import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String }, 
    prices: {
      male: { type: Number },
      female: { type: Number },
    },
    duration: {type: Number, default: 30},
    isActive: { type: Boolean, default: true }, // Soft Delete
  },
  { timestamps: true },
);

export default mongoose.model("Service", serviceSchema);
