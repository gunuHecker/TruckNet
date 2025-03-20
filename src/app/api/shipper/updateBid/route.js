import { NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig";
import connectToDatabase from "@/dbConfig/dbConfig";
import Bid from "@/models/bidModel";
import Load from "@/models/loadModel";
import { authenticateAPI } from "@/utils/authMiddleware";

export async function POST(req) {
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
    
    const { bidId, status } = await req.json();

    // Update the bid status
    const bid = await Bid.findByIdAndUpdate(bidId, { status }, { new: true });

    if (!bid) {
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 }
      );
    }

    // Only update load if bid is accepted
    if (status === "accepted") {
      const loadId = bid.loadId;

      const load = await Load.findByIdAndUpdate(
        loadId,
        { status: "assigned", assignedTrucker: bid.truckerId }, // ✅ Correct field name
        { new: true }
      );

      if (!load) {
        return NextResponse.json(
          { success: false, message: "Load not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ success: true, bid });
  } catch (error) {
    console.error("Error updating bid:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update bid" },
      { status: 500 }
    );
  }
}
