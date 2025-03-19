"use client";
import { useEffect, useState } from "react";

export default function LoadDetailsBar({
  load,
  winningBid,
  timer,
  isShipper,
  onStartBidding,
  biddingStarted,
}) {

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">Load Details</h2>
        <p>
          Pickup: {load?.pickupLocation} → Dropoff: {load?.dropoffLocation}
        </p>
        <p>
          Weight: {load?.weight} kg | Truck Type: {load?.truckType}
        </p>
        <p>Shipper ID: {load?.shipperId}</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Winning Bid: ₹{winningBid}</h2>
        <p className="text-red-400 font-bold">Timer: {timer}s</p>

        {/* Show "Start Bidding" button only for the shipper */}
        {isShipper && !biddingStarted && (
          <button
            onClick={onStartBidding}
            className="bg-blue-500 px-4 py-2 rounded-md text-white font-bold"
          >
            Start Bidding
          </button>
        )}
      </div>
    </div>
  );
}
