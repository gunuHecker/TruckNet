import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Bid from "@/models/bidModel";
import Load from "@/models/loadModel";

export async function POST(req) {
  try {
    await connect();
    const { bidId, status } = await req.json();

    // Update the bid status
    const bid = await Bid.findByIdAndUpdate(bidId, { status }, { new: true });

    if (!bid) {
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 }
      );
    }

    // Only update load if bid is accepted
    if (status === "accepted") {
      const loadId = bid.loadId;

      const load = await Load.findByIdAndUpdate(
        loadId,
        { status: "assigned", assignedTrucker: bid.truckerId }, // ✅ Correct field name
        { new: true }
      );

      if (!load) {
        return NextResponse.json(
          { success: false, message: "Load not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ success: true, bid });
  } catch (error) {
    console.error("Error updating bid:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update bid" },
      { status: 500 }
    );
  }
}
