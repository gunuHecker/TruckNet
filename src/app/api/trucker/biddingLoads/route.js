import { NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig";
import connectToDatabase from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";
import { authenticateAPI } from "@/utils/authMiddleware";

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

    // Fetch assigned loads for this trucker
    const biddingLoads = await Load.find({
      status: "bidding",
    }).sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      loads: biddingLoads,
    });
  } catch (error) {
    console.error("Error fetching assigned loads:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
