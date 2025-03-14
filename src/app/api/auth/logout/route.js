import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear authentication cookies
    const cookieStore = await cookies();
    cookieStore.set("token", "", { expires: new Date(0), httpOnly: true });
    cookieStore.set("userId", "", { expires: new Date(0), httpOnly: true });

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Logout failed", error: error.message },
      { status: 500 }
    );
  }
}
