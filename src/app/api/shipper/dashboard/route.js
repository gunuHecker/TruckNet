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
    if (auth.user.role !== "shipper") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // await connect();
    await connectToDatabase();

    const userId = getUserIdFromCookies(req);
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: No shipper ID found in cookies.",
        },
        { status: 401 }
      );
    }

    // Fetch statistics
    const activeLoads = await Load.countDocuments({
      shipperId: userId,
      status: { $in: ["open", "bidding", "assigned"] },
    });

    const pendingBids = await Bid.find({ status: "pending" }).populate(
      "loadId"
    );
    const shipperPendingBids = pendingBids.filter(
      (bid) => bid.loadId?.shipperId.toString() === userId
    );
    const pendingBidsCount = shipperPendingBids.length;

    const completedLoads = await Load.countDocuments({
      shipperId: userId,
      status: "completed",
    });

    // const totalPayments = await Payment.aggregate([
    //   { $match: { shipperId: userId } },
    //   { $group: { _id: null, total: { $sum: "$amount" } } },
    // ]);
    // const totalPaymentsAmount = totalPayments.length
    //   ? totalPayments[0].total
    //   : 0;

    const totalPaymentsAmount = 0;

    // Fetch recent activities
    const recentBids = await Bid.find({ shipperId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("truckerId", "name")
      .populate("loadId", "pickupLocation dropoffLocation");

    // const recentPayments = await Payment.find({ shipperId: userId })
    //   .sort({ createdAt: -1 })
    //   .limit(5);

    const formattedRecentActivity = [
      ...recentBids.map(
        (bid) =>
          `Trucker ${bid.truckerId.name} placed a bid on load from ${bid.loadId.pickupLocation} to ${bid.loadId.dropoffLocation}.`
       ),
      // ...recentPayments.map(
      //   (payment) =>
      //     `Payment of $${payment.amount} received for load #${payment.loadId}.`
      // ),
    ].slice(0, 5);

    return NextResponse.json({
      stats: {
        activeLoads,
        pendingBidsCount,
        completedLoads,
        totalPayments: totalPaymentsAmount,
      },
      recentActivity: formattedRecentActivity,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
