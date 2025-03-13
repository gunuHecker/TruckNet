// Purpose: Stores benefits truckers can claim.
// Categories: Fuel, lodging, tires, food, etc.

import mongoose from "mongoose";

const BenefitSchema = new mongoose.Schema({
  truckerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  discountType: {
    type: String,
    enum: ["insurance", "fuel", "lodging", "food", "tires", "spare parts"],
    required: true,
  },
  discountAmount: { type: Number, required: true },
  status: { type: String, enum: ["claimed", "pending"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Benefit ||
  mongoose.model("Benefit", BenefitSchema);
