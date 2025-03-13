import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";

connect();

export async function GET() {
  try {
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
