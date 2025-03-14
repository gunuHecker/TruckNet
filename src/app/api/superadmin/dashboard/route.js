import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig"; // Ensure DB connection
import User from "@/models/userModel";
import Load from "@/models/loadModel";
import Bid from "@/models/bidModel";
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

    // Count total shippers who are approved
    const totalShippers = await User.countDocuments({
      role: "shipper",
      approved: "yes",
    });

    // Count total truckers who are approved
    const totalTruckers = await User.countDocuments({
      role: "trucker",
      approved: "yes",
    });

    // Count active loads (status: open, bidding, or assigned)
    const activeLoads = await Load.countDocuments({
      status: { $in: ["open", "bidding", "assigned"] },
    });

    // Count total bids
    const totalBids = await Bid.countDocuments();

    // Get recent activity (latest 5 actions)
    const recentActivity = await Bid.find()
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(5)
      .populate("truckerId", "name") // Populate trucker name
      .populate("loadId", "pickupLocation dropoffLocation"); // Populate load details

    const formattedActivity = recentActivity.map(
      (bid) =>
        `${bid.truckerId.name} placed a bid on load from ${bid.loadId.pickupLocation} to ${bid.loadId.dropoffLocation}.`
    );

    return NextResponse.json({
      stats: {
        totalShippers,
        totalTruckers,
        activeLoads,
        totalBids,
        revenue: 0, // You can add revenue logic if applicable
      },
      recentActivity: formattedActivity,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
