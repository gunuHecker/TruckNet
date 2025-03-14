import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Bid from "@/models/bidModel";
import Load from "@/models/loadModel";
import { authenticateAPI } from "@/utils/authMiddleware";

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
    const auth = await authenticateAPI(req);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only allow shippers to access this API
    if (auth.user.role !== "trucker") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
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
    const auth = await authenticateAPI(req);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only allow shippers to access this API
    if (auth.user.role !== "trucker") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
      // ✅ Update the existing bid amount
      existingBid.amount = amount;
      await existingBid.save();

      const load = await Load.findById(loadId);

      if (load) {
        // ✅ Update status if the load is still "open"
        if (load.status === "open") {
          load.status = "bidding";
        }

        // ✅ Remove old bid from `bids` array (if it exists)
        load.bids = load.bids.filter(
          (bidId) => bidId.toString() !== existingBid._id.toString()
        );

        // ✅ Add updated bid to `bids` array
        load.bids.push(existingBid._id);

        await load.save(); // ✅ Save the updated load
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

    const load = await Load.findById(loadId);

    if (load) {
      // ✅ Update status if the load is still "open"
      if (load.status === "open") {
        load.status = "bidding";
      }

      // ✅ Add the bid to the bids array (if not already present)
      if (!load.bids.includes(newBid._id)) {
        load.bids.push(newBid._id);
      }

      await load.save(); // ✅ Save the updated load
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
