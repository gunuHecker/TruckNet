import { NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig";
import connectToDatabase from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";
import Bid from "@/models/bidModel";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    // await connect();
    await connectToDatabase();
    const { loadId } = await params;

    // Ensure loadId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(loadId)) {
      // console.log("Invalid load id");
      return NextResponse.json(
        { success: false, error: "Invalid Load ID" },
        { status: 400 }
      );
    }

    // Fetch load details and populate bids and assigned trucker
    const load = await Load.findById(loadId)
      .populate("bids") // Populating bids if referenced
      .populate("assignedTrucker", "userId truckNumber"); // Populate assigned trucker details

    if (!load) {
      // console.log("Load not found");
      return NextResponse.json(
        { success: false, error: "Load not found" },
        { status: 404 }
      );
    }

    // console.log(load)

    // Fetch all bids for this load and find the lowest bid
    const bids = await Bid.find({ loadId }).sort({ bidAmount: 1 });
    const winningBid = bids.length > 0 ? bids[0].bidAmount : null; // Current lowest bid

    return NextResponse.json({
      success: true,
      load,
      //   truckers,
      winningBid,
    });
  } catch (error) {
    // console.error("Error fetching load data:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
