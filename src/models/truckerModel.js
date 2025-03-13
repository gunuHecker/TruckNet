// Purpose: Stores truckers' eligibility criteria.
// Eligibility Conditions:
// No accidents
// No theft complaints
// Truck age ≤ 5 years
// License duration ≥ 5 years

import mongoose from "mongoose";

const TruckerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  truckNumber: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  truckAge: { type: Number, required: true },
  accidentHistory: { type: Boolean, default: false },
  theftComplaints: { type: Boolean, default: false },
  licenseDuration: { type: Number, required: true }, // in years
  eligible: { type: Boolean, default: false }, // Determined by backend
});

export default mongoose.models.Trucker ||
  mongoose.model("Trucker", TruckerSchema);
