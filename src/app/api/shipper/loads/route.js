import { NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig";
import connectToDatabase from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";
import User from "@/models/userModel";
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

    // await connect();
    await connectToDatabase();

    const shipperId = getUserIdFromCookies(req);

    if (!shipperId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: No shipper ID found in cookies.",
        },
        { status: 401 }
      );
    }

    const loads = await Load.find({ shipperId })
      .populate({ path: "assignedTrucker", select: "name" }) // Get trucker name if assigned
      .lean();

    return NextResponse.json({ success: true, loads }, { status: 200 });
  } catch (error) {
    console.error("Error fetching shipper loads:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
