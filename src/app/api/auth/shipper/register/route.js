// import { connect } from "@/dbConfig/dbConfig";
import connectToDatabase from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

// connect();

export async function POST(request) {
  try {
    await connectToDatabase();
    // Parse incoming request data
    const reqBody = await request.json();
    const { name, email, password, phone } = reqBody;
    // console.log(reqBody);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new shipper user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "shipper", // Default to shipper
      approved: "pending", // Shipper approval pending by default
      phone,
    });

    // save the user to the database
    const savedUser = await newUser.save();
    // console.log("Saved User: ", savedUser);

    return NextResponse.json({ 
        message: "Shipper registered successfully", 
        success: true,
        savedUser,
    })
  } catch (error) {
    // console.error("Registration Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}