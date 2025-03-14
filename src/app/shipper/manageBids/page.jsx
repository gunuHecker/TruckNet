"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ShipperSidebar from "@/components/sidebars/ShipperSidebar"; // Importing sidebar

export default function ManageBids() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Filter state

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const response = await axios.get("/api/shipper/manageBids");
      if (response.data.success) {
        setLoads(response.data.loads);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBidAction = async (bidId, status) => {
    try {
      const response = await axios.post("/api/shipper/updateBid", {
        bidId,
        status,
      });
      if (response.data.success) {
        fetchBids(); // Refresh bids after update
      }
    } catch (error) {
      console.error("Error updating bid:", error);
    }
  };

  const filteredLoads = loads.map((load) => ({
    ...load,
    bids: load.bids.filter((bid) =>
      filter === "all" ? true : bid.status === filter
    ),
  }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <ShipperSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 text-gray-900">
        <h1 className="text-2xl font-semibold mb-4">Manage Bids</h1>

        {/* Filter Dropdown */}
        <div className="mb-4">
          <label className="mr-2 font-medium">Filter Bids:</label>
          <select
            className="border p-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-6">
            {filteredLoads.length === 0 ? (
              <p>No bids found.</p>
            ) : (
              filteredLoads.map((load) => (
                <div
                  key={load._id}
                  className="border p-4 rounded-lg shadow-md bg-white"
                >
                  <h2 className="text-lg font-bold">
                    Load: {load.pickupLocation} → {load.dropoffLocation}
                  </h2>
                  <p>
                    <strong>Weight:</strong> {load.weight} kg
                  </p>
                  <p>
                    <strong>Truck Type:</strong> {load.truckType}
                  </p>
                  <p>
                    <strong>Status:</strong> {load.status}
                  </p>

                  <h3 className="mt-3 font-semibold">Bids:</h3>
                  {load.bids.length === 0 ? (
                    <p>No bids yet.</p>
                  ) : (
                    <table className="w-full mt-2 border">
                      <thead>
                        <tr className="bg-gray-200 text-black">
                          <th className="p-2 border">Trucker</th>
                          <th className="p-2 border">Amount</th>
                          <th className="p-2 border">Status</th>
                          <th className="p-2 border">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {load.bids.map((bid) => (
                          <tr key={bid._id} className="text-center">
                            <td className="p-2 border">
                              {bid.truckerId?.name || "N/A"}
                            </td>
                            <td className="p-2 border">${bid.amount}</td>
                            <td className="p-2 border">
                              <span
                                className={`px-2 py-1 text-white text-sm rounded ${
                                  bid.status === "pending"
                                    ? "bg-yellow-500"
                                    : bid.status === "accepted"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              >
                                {bid.status}
                              </span>
                            </td>
                            <td className="p-2 border">
                              {bid.status === "pending" && (
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() =>
                                      handleBidAction(bid._id, "accepted")
                                    }
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleBidAction(bid._id, "rejected")
                                    }
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
