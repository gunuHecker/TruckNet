import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Trucker from "@/models/truckerModel";
// import { getTokenFromCookies, verifyToken } from "@/utils/authUtils"; // Helper function

connect();

export async function POST(req) {
  try {
    // Get user ID from the cookie
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
        console.log("No cookie");
        return NextResponse.json(
        { message: "Unauthorized: No cookie provided" },
        { status: 401 }
      );
    }
    console.log(cookieHeader);

    // Convert cookies into an object
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );

    console.log(cookies.userId)
    const userId = cookies.userId;

    // Parse request body
    const {
      truckNumber,
      licenseNumber,
      truckAge,
      accidentHistory,
      theftComplaints,
      licenseDuration,
    } = await req.json();

    // Validate input fields
    if (!truckNumber || !licenseNumber || !truckAge || !licenseDuration) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine trucker's eligibility
    const eligible =
      !accidentHistory &&
      !theftComplaints &&
      truckAge <= 5 &&
      licenseDuration >= 5;

    // Check if trucker record already exists
    const existingTrucker = await Trucker.findOne({ userId });
    if (existingTrucker) {
      return NextResponse.json(
        { message: "Trucker details already submitted" },
        { status: 400 }
      );
    }

    // Create and save new trucker details
    const newTrucker = new Trucker({
      userId,
      truckNumber,
      licenseNumber,
      truckAge,
      accidentHistory,
      theftComplaints,
      licenseDuration,
      eligible,
    });

    await newTrucker.save();

    return NextResponse.json({
      message: "Trucker details submitted successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error submitting trucker details:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
