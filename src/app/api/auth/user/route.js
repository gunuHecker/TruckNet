import { NextResponse } from "next/server";

export async function GET(req) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) {
    return NextResponse.json(
      { success: false, message: "No cookies found" },
      { status: 401 }
    );
  }

  // Parse cookies
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  if (!cookies.userId) {
    return NextResponse.json(
      { success: false, message: "User not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, userId: cookies.userId });
}
