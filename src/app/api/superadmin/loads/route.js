import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";
import User from "@/models/userModel";

export async function GET() {
  try {
    await connect(); // Ensure database connection

    // Fetch all loads with shipper and assigned trucker details
    const loads = await Load.find()
      .populate("shipperId", "name") // Get shipper name
      .populate("assignedTrucker", "name"); // Get assigned trucker name

    const formattedLoads = loads.map((load) => ({
      _id: load._id,
      shipperName: load.shipperId ? load.shipperId.name : "Unknown",
      pickupLocation: load.pickupLocation,
      dropoffLocation: load.dropoffLocation,
      weight: load.weight,
      status: load.status,
      bids: load.bids, // Array of bid IDs
      assignedTrucker: load.assignedTrucker
        ? load.assignedTrucker.name
        : "Not Assigned",
    }));

    return NextResponse.json({ success: true, loads: formattedLoads });
  } catch (error) {
    console.error("Error fetching loads:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
