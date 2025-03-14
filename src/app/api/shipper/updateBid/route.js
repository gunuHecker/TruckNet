import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Bid from "@/models/bidModel";
import Load from "@/models/loadModel"

export async function POST(req) {
  try {
    await connect();
    const { bidId, status } = await req.json();

    const bid = await Bid.findByIdAndUpdate(bidId, { status }, { new: true });

    if (!bid) {
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 }
      );
    }

    // also update that load in load schema status to "assigned" if status = accepted.
    const loadId = bid.loadId;
    const load = await Load.findByIdAndUpdate(
      loadId,
      { status: "assigned" },
      { new: true }
    );

    return NextResponse.json({ success: true, bid });
  } catch (error) {
    console.error("Error updating bid:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update bid" },
      { status: 500 }
    );
  }
}