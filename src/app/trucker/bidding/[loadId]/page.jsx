"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TruckerSidebar from "@/components/sidebars/TruckerSidebar"; // Import sidebar

export default function BiddingPage() {
  const { loadId } = useParams();
  const router = useRouter();

  const [bids, setBids] = useState([]);
  const [myBid, setMyBid] = useState(null);
  const [newBidAmount, setNewBidAmount] = useState("");
  const [truckerId, setTruckerId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch truckerId from backend API
  useEffect(() => {
    async function fetchTruckerId() {
      try {
        const res = await fetch("/api/auth/user", { credentials: "include" });
        const data = await res.json();

        if (data.success && data.userId) {
          setTruckerId(data.userId);
        } else {
          console.warn("User not authenticated:", data.message);
        }
      } catch (error) {
        console.error("Error fetching trucker ID:", error);
      }
    }

    fetchTruckerId();
  }, []);

  // Fetch all bids for the load
  useEffect(() => {
    async function fetchBids() {
      if (!loadId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/bidding/${loadId}`);
        const data = await res.json();

        if (data.success) {
          setBids(data.bids);
          setMyBid(data.myBid);
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
      setLoading(false);
    }

    fetchBids();
  }, [loadId]);

  // Place or update a bid
  const placeOrUpdateBid = async () => {
    if (!newBidAmount || isNaN(newBidAmount) || Number(newBidAmount) <= 0) {
      alert("Enter a valid bid amount.");
      return;
    }

    if (!truckerId) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      const res = await fetch(`/api/bidding/${loadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(newBidAmount),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        setNewBidAmount("");
        router.refresh(); // Refresh page data
      } else {
        alert("Failed: " + data.message);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <TruckerSidebar />

      {/* Main content */}
      <div className="flex-1 p-6 text-black">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bidding for Load
        </h1>

        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Current Bids</h2>
          {loading ? (
            <p>Loading bids...</p>
          ) : (
            <ul className="border border-gray-300 rounded p-3">
              {bids.length > 0 ? (
                bids.map((bid) => (
                  <li
                    key={bid._id}
                    className={`p-2 ${
                      bid.truckerId === truckerId
                        ? "text-green-600 font-bold"
                        : "text-gray-700"
                    }`}
                  >
                    {bid.truckerId === truckerId
                      ? "Your Bid: "
                      : "Other Trucker: "}
                    ${bid.amount}
                  </li>
                ))
              ) : (
                <p>No bids yet.</p>
              )}
            </ul>
          )}
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">
            {myBid ? "Update Your Bid" : "Place a Bid"}
          </h2>
          <input
            type="number"
            placeholder="Enter bid amount"
            className="p-2 border rounded w-full mb-3"
            value={newBidAmount}
            onChange={(e) => setNewBidAmount(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            onClick={placeOrUpdateBid}
            disabled={!truckerId}
          >
            {myBid ? "Update Bid" : "Place Bid"}
          </button>
          {!truckerId && (
            <p className="text-red-600 mt-2">Please log in to place a bid.</p>
          )}
        </div>
      </div>
    </div>
  );
}