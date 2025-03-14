import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";

export async function GET(req) {
  try {
    await connect();

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