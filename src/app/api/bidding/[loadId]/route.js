import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Bid from "@/models/bidModel";
import Load from "@/models/loadModel"

connect();

// Helper function to extract userId from cookies
function getUserIdFromCookies(req) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  return cookies.userId || null;
}

// 📌 GET: Fetch all bids for a load (sorted by amount) & trucker's bid
export async function GET(req, context) {
  try {
    const { loadId } = await context.params; // ✅ Correct way to access params

    const truckerId = getUserIdFromCookies(req);
    if (!truckerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: No user ID found in cookies.",
        },
        { status: 401 }
      );
    }

    const bids = await Bid.find({ loadId }).sort({ amount: 1 }); // Sort by lowest bid first
    const myBid =
      bids.find((bid) => bid.truckerId.toString() === truckerId) || null;

    return NextResponse.json({ success: true, bids, myBid });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}

// 📌 POST: Place a bid or update an existing bid
export async function POST(req, context) {
  try {
    const { loadId } = await context.params; // ✅ Correct way to access params

    const truckerId = getUserIdFromCookies(req);
    if (!truckerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: No user ID found in cookies.",
        },
        { status: 401 }
      );
    }

    const { amount } = await req.json();

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid bid amount." },
        { status: 400 }
      );
    }

    // Check if the trucker already placed a bid
    const existingBid = await Bid.findOne({ loadId, truckerId });

    if (existingBid) {
      existingBid.amount = amount;
      await existingBid.save();
      // ✅ Update load status if it's still "open"
      const load = await Load.findById(loadId);
      if (load && load.status === "open") {
        load.status = "bidding";
        await load.save();
      }
      return NextResponse.json({
        success: true,
        message: "Bid updated successfully!",
      });
    }

    // Create a new bid
    const newBid = new Bid({
      loadId,
      truckerId,
      amount,
      status: "pending",
    });

    await newBid.save();

    // ✅ Update load status if it's still "open"
    const load = await Load.findById(loadId);
    if (load && load.status === "open") {
      load.status = "bidding";
      await load.save();
    }

    return NextResponse.json({
      success: true,
      message: "Bid placed successfully!",
    });
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
