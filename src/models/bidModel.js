// Purpose: Stores trucker bids for loads.
// Status Tracking: Pending, accepted, or rejected.

import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
  loadId: { type: mongoose.Schema.Types.ObjectId, ref: "Load", required: true },
  truckerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Bid || mongoose.model("Bid", BidSchema);
