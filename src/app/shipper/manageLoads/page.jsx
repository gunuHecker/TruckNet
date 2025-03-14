"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManageLoads() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchLoads() {
      try {
        const res = await fetch("/api/shipper/manageLoads");
        const data = await res.json();

        if (data.success) {
          setLoads(data.loads || []);
        } else {
          setError("Failed to fetch loads");
        }
      } catch (err) {
        setError("Error fetching data");
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLoads();
  }, []);

  const handleAction = async (bidId, status) => {
    try {
      const res = await fetch("/api/shipper/updateBid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidId, status }),
      });

      const result = await res.json();
      if (result.success) {
        setLoads((prevLoads) =>
          prevLoads.map((load) => ({
            ...load,
            bids: load.bids.map((bid) =>
              bid._id === bidId ? { ...bid, status } : bid
            ),
          }))
        );
      } else {
        alert("Failed to update bid status");
      }
    } catch (err) {
      console.error("Error updating bid:", err);
    }
  };

  return (
    <div className="text-black p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">📦 Manage Loads</h1>

      {loading && <p className="text-center text-gray-500">Loading loads...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && loads.length === 0 && (
        <p className="text-center text-gray-500">No loads found.</p>
      )}

      {loads.map((load) => (
        <div key={load._id} className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Load ID: {load._id}
          </h2>
          <p className="text-gray-600">
            Pickup Location: {load.pickupLocation}
          </p>
          <p className="text-gray-600">
            Dropoff Location: {load.dropoffLocation}
          </p>
          <p className="text-gray-600">Weight: {load.weight} kg</p>
          <p className="text-gray-600">Status: {load.status}</p>

          <h3 className="mt-4 text-lg font-semibold text-gray-700">Bids:</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse mt-2">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4">Trucker</th>
                  <th className="p-4">Bid Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {load.bids.length > 0 ? (
                  load.bids.map((bid) => (
                    <tr key={bid._id} className="hover:bg-gray-50 transition">
                      <td className="p-4">{bid.truckerId}</td>
                      <td className="p-4">${bid.amount}</td>
                      <td className="p-4">{bid.status}</td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                          onClick={() => handleAction(bid._id, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                          onClick={() => handleAction(bid._id, "rejected")}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No bids for this load.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
