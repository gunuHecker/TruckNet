// Purpose: Stores payment history of shippers & truckers.
// Tracks: Credit, debit, and remaining balance.

import mongoose from "mongoose";

const LedgerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactions: [
    {
      type: { type: String, enum: ["credit", "debit"], required: true },
      amount: { type: Number, required: true },
      description: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  balance: { type: Number, default: 0 },
});

export default mongoose.models.Ledger || mongoose.model("Ledger", LedgerSchema);
