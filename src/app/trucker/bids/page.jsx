"use client";

import { useState, useEffect } from "react";
import TruckerSidebar from "@/components/sidebars/TruckerSidebar";

export default function TruckerBidsPage() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBids() {
      try {
        const res = await fetch("/api/trucker/bids");
        const data = await res.json();
        setBids(data.bids || []);
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBids();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <TruckerSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">My Bids</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading bids...</p>
        ) : bids.length === 0 ? (
          <p className="text-center text-gray-400">
            You haven't placed any bids yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bids.map((bid) => (
              <BidCard key={bid._id} bid={bid} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BidCard({ bid }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl hover:shadow-xl transition-all transform hover:scale-105">
      <h2 className="text-xl font-bold text-blue-400">
        Load: {bid.loadId.pickupLocation} → {bid.loadId.dropoffLocation}
      </h2>
      <div className="mt-4 space-y-2 text-gray-300">
        <p>
          <strong>Weight:</strong> {bid.loadId.weight} kg
        </p>
        <p>
          <strong>Truck Type:</strong> {bid.loadId.truckType}
        </p>
        <p>
          <strong>Your Bid:</strong> ${bid.amount}
        </p>
      </div>
      <div className="mt-4">
        <span
          className={`px-3 py-1 text-sm rounded-lg ${
            bid.status === "pending"
              ? "bg-yellow-500 text-white"
              : bid.status === "accepted"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
        </span>
      </div>
    </div>
  );
}