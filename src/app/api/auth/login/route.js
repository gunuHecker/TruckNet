// import { connect } from "@/dbConfig/dbConfig";
import connectToDatabase from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";

// connect();

export async function POST(request) {
  try {
    await connectToDatabase();
    const reqBody = await request.json();
    const { role, email, password } = reqBody;
    // console.log(reqBody);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // Check if the role matches
    if (user.role !== role) {
      return NextResponse.json(
        {
          error: "Access denied. User role mismatch.",
        },
        { status: 403 }
      );
    }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Create token data
    const tokenData = {
      id: user._id.toString(),
      username: user.name,
      email: user.email,
      role: user.role,
      approved: user.approved,
    };

    // Convert secret key to Uint8Array (required by jose)
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);

    // Create JWT using `jose`
    const token = await new SignJWT(tokenData)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    // Create response with cookies
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      userId: user._id,
      token,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    response.cookies.set("userId", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
