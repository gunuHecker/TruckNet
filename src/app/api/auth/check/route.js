import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    const cookieStore = await cookies(); // No need to await this
    const token = cookieStore.get("token")?.value; // Access the token properly
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);
    // console.log("Payload: ", payload)

    return NextResponse.json({
      success: true,
      token,
      userId: payload.id,
      userRole: payload.role,
      username: payload.username,
    });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}