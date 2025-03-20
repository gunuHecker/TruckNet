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

    // Fetch all loads where status is either "open" or "bidding"
    const openLoads = await Load.find({
      status: { $in: ["open", "bidding"] },
    }).populate("shipperId", "name email");

    return NextResponse.json(
      { success: true, loads: openLoads },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching open loads:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
