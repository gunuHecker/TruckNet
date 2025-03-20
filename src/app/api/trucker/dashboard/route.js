import { NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig";
import connectToDatabase from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";
import Bid from "@/models/bidModel";
import { authenticateAPI } from "@/utils/authMiddleware";

// Helper function to extract userId from cookies
function getUserIdFromCookies(req) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  return cookies.userId || null;
}

export async function GET(req) {
  try {
    const auth = await authenticateAPI(req);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only allow shippers to access this API
    if (auth.user.role !== "trucker") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // await connect();
    await connectToDatabase();

    const userId = getUserIdFromCookies(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No trucker ID found." },
        { status: 401 }
      );
    }

    // 1️⃣ Count available loads (status: "open" or "bidding")
    const availableLoads = await Load.countDocuments({
      status: { $in: ["open", "bidding"] },
    });

    // 2️⃣ Count active bids where truckerId = userId
    const activeBids = await Bid.countDocuments({ truckerId: userId });

    // 3️⃣ Count assigned loads where assignedTruckerId = userId and status = "assigned"
    const assignedLoads = await Load.countDocuments({
      assignedTrucker: userId,
      status: "assigned",
    });

    // 4️⃣ Set earnings and benefits claimed to 0 (placeholder)
    const earnings = 0;
    const benefitsClaimed = 0;

    return NextResponse.json({
      success: true,
      stats: {
        availableLoads,
        activeBids,
        assignedLoads,
        earnings,
        benefitsClaimed,
      },
      recentActivity: [
        "Bid placed on Load #123",
        "Load #456 assigned to you",
        "Payment processed for Load #789",
      ],
    });
  } catch (error) {
    console.error("Error fetching trucker dashboard stats:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
