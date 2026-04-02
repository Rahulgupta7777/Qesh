import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "L'Oreal Hair Spa Kit"
    category: { type: String, required: true }, // e.g., "Hair Care"
    price: { type: Number, required: true }, // Price in ₹ 
    stock: { type: Number, required: true }, // Inventory Count
    image: { type: String }, // URL to image
    isActive: { type: Boolean, default: true }, // Soft Delete
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
