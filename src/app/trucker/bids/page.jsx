"use client";

import { useState, useEffect } from "react";

export default function TruckerBidsPage() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    async function fetchBids() {
      try {
        const res = await fetch("/api/trucker/bids");
        const data = await res.json();
        setBids(data.bids);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    }
    fetchBids();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">My Bids</h1>

      {bids.length === 0 ? (
        <p className="text-gray-600">You haven't placed any bids yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bids.map((bid) => (
            <BidCard key={bid._id} bid={bid} />
          ))}
        </div>
      )}
    </div>
  );
}

function BidCard({ bid }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-black">
        Load: {bid.loadId.pickupLocation} → {bid.loadId.dropoffLocation}
      </h2>
      <p className="text-gray-700">
        <strong>Weight:</strong> {bid.loadId.weight} kg
      </p>
      <p className="text-gray-700">
        <strong>Truck Type:</strong> {bid.loadId.truckType}
      </p>
      <p className="text-gray-700">
        <strong>Your Bid:</strong> ${bid.amount}
      </p>
      <p
        className={`mt-2 px-3 py-1 inline-block rounded-lg text-white ${
          bid.status === "accepted"
            ? "bg-green-500"
            : bid.status === "rejected"
            ? "bg-red-500"
            : "bg-yellow-500"
        }`}
      >
        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
      </p>
    </div>
  );
}
