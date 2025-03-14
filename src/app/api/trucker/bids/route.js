import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Bid from "@/models/bidModel";
import Load from "@/models/loadModel";
import { authenticateAPI } from "@/utils/authMiddleware";

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

    await connect();

    const truckerId = getUserIdFromCookies(req);

    if (!truckerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: No trucker ID found in cookies.",
        },
        { status: 401 }
      );
    }

    // Fetch bids where the trucker has placed bids
    const bids = await Bid.find({ truckerId })
      .populate({
        path: "loadId",
        select:
          "pickupLocation dropoffLocation weight truckType status shipperId assignedTrucker",
      })
      .lean();

    // Filter loads based on the required condition
    const filteredBids = bids.filter((bid) => {
      const load = bid.loadId;
      return (
        load.status === "open" ||
        load.status === "bidding" ||
        (load.status === "assigned" &&
          load.assignedTrucker?.toString() === truckerId)
      );
    });

    // Return the filtered bids
    return NextResponse.json({ bids: filteredBids }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trucker bids:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
