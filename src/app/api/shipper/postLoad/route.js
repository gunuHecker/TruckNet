import { NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig";
import connectToDatabase from "@/dbConfig/dbConfig";
import Load from "@/models/loadModel";
import { authenticateAPI } from "@/utils/authMiddleware";


export async function POST(req) {
  try {
    // await connect();
    await connectToDatabase();

    const auth = await authenticateAPI(req);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    
    // Only allow shippers to access this API
    if (auth.user.role !== "shipper") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Get user ID (of shipper) from the cookie
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      // console.log("No cookie");
      return NextResponse.json(
        { message: "Unauthorized: No cookie provided" },
        { status: 401 }
      );
    }
    // console.log(cookieHeader);

    // Convert cookies into an object
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );
    
    // console.log(cookies.userId);
    const shipperId = cookies.userId;
    
    const { pickupLocation, dropoffLocation, weight, truckType, deliveryDate } = await req.json();
    

    if (
      !pickupLocation ||
      !dropoffLocation ||
      !weight ||
      !truckType ||
      !deliveryDate
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const newLoad = new Load({
      shipperId,
      pickupLocation,
      dropoffLocation,
      weight,
      truckType,
      deliveryDate,
    });

    await newLoad.save();

    return NextResponse.json(
      { message: "Load posted successfully", load: newLoad },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error posting load:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
