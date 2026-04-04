import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: {
      type: String,
      enum: [
        "salon_manager",
        "assistant_manager",
        "casier",
        "receptionist",
        "stylist",
        "beautician",
        "makeup_artist",
        "helper",
      ],
      default: "stylist",
    },
    specialization: {
      type: [String],
      default: [],
    },
    isActive: { type: Boolean, default: true }, // For busy Checking
    isDeleted: { type: Boolean, default: false }, // For soft delete (Admin can reactivate if needed)
  },
  { timestamps: true },
);

export default mongoose.model("Staff", staffSchema);
