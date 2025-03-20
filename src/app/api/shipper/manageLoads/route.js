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
    if (auth.user.role !== "shipper") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // await connect();
    await connectToDatabase();

    // Fetch loads with trucker bids
    const loads = await Load.find().populate("bids");

    return NextResponse.json({ success: true, loads });
  } catch (error) {
    console.error("Error fetching loads:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch loads" },
      { status: 500 }
    );
  }
}
