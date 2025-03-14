import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";
import User from "@/models/userModel";
import { authenticateAPI } from "@/utils/authMiddleware";

export async function GET(req) {
  try {
    const auth = await authenticateAPI(req);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only allow shippers to access this API
    if (auth.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
