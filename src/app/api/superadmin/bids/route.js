import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Bid from "@/models/bidModel";

export async function GET() {
  try {
    await connect();
    const bids = await Bid.find().sort({ amount: 1 }); // Fetch bids, sort by lowest bid

    return NextResponse.json({ success: true, bids });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}