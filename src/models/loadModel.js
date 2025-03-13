// Purpose: Stores load details posted by shippers.
// Tracks: Load status, bidding process, assigned trucker.

import mongoose from "mongoose";

const LoadSchema = new mongoose.Schema({
  shipperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  weight: { type: Number, required: true },
  truckType: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["open", "bidding", "assigned", "completed"],
    default: "open",
  },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
  assignedTrucker: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned trucker
  trackingStatus: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Load || mongoose.model("Load", LoadSchema);
