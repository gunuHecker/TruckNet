import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";
import { authenticateAPI } from "@/utils/authMiddleware";

// 📌 POST: Store the winner in the database
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

    await connect();

    const { loadId, winnerId, winningBid } = await req.json();

    if (!loadId || !winnerId || !winningBid) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Update the load with the winner details
    const load = await Load.findByIdAndUpdate(
      loadId,
      {
        winningBid: winningBid,
        assignedTrucker: winnerId,
        status: "assigned", // Mark the load as completed
      },
      { new: true } // Return the updated document
    );

    if (!load) {
      return NextResponse.json(
        { success: false, message: "Load not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, load });
  } catch (error) {
    console.error("Error storing winner:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
