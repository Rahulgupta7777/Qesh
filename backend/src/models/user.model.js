import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, sparse: true }, // Customer ID
  email: { type: String, unique: true, sparse: true }, // for booking notification and staff/admin login
  password: { type: String }, // Only for Admin/Staff
  role: { type: String, enum: ["user", "admin", "staff"], default: "user" },
  subscriptions: [{
    name: { type: String }, // e.g., "Gold Membership", "Gel Polish Yearly"
    type: { type: String, enum: ["general_discount", "service_specific"] }, 
    expiry: { type: Date },
    isActive: { type: Boolean, default: true }
  }],
  name: { type: String },
  staffProfile: {type: mongoose.Schema.Types.ObjectId, ref: "Staff"},
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
