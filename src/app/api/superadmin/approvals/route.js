import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Trucker from "@/models/truckerModel"; // Import Trucker schema

connect();

export async function GET() {
  try {
    // Fetch users where approval status is "pending"
    const pendingUsers = await User.find({ approved: "pending" });

    // Fetch trucker details for users with role "trucker"
    const pendingApprovals = await Promise.all(
      pendingUsers.map(async (user) => {
        if (user.role === "trucker") {
          const truckerDetails = await Trucker.findOne({ userId: user._id });
          return { ...user.toObject(), truckerDetails };
        }
        return user.toObject();
      })
    );

    return NextResponse.json({ pendingApprovals }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
