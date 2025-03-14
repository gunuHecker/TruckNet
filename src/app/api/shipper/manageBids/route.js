import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";
import Bid from "@/models/bidModel";
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
    if (auth.user.role !== "shipper") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connect();

    const shipperId = getUserIdFromCookies(req);

    if (!shipperId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No shipper ID found." },
        { status: 401 }
      );
    }

    // Fetch loads posted by the current shipper that are "open" or "bidding"
    const loads = await Load.find({
      shipperId,
      status: { $in: ["open", "bidding"] },
    })
      .populate({
        path: "bids",
        populate: { path: "truckerId", select: "name email" }, // Fetch trucker details
      })
      .lean();

    return NextResponse.json({ success: true, loads }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}
