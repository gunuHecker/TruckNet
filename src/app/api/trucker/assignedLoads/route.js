import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";

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
    await connect();

    const userId = getUserIdFromCookies(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No trucker ID found." },
        { status: 401 }
      );
    }

    // Fetch assigned loads for this trucker
    const assignedLoads = await Load.find({
      assignedTrucker: userId,
      status: "assigned",
    }).sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      assignedLoads,
    });
  } catch (error) {
    console.error("Error fetching assigned loads:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
