// // 5️⃣ Monitor Bids – /superadmin/bids
// // ✅ Purpose: Track & oversee trucker bids on loads.
// // 🔹 UI:

// // Table with columns (Load ID, Shipper, Trucker, Bid Amount, Status)
// // Lowest bid highlighted
// // Sort by price, trucker rating, date
// // Action buttons (Accept, Reject, View Trucker Profile)

"use client";

import { useState, useEffect } from "react";
import SuperAdminSidebar from "@/components/sidebars/SuperAdminSidebar";

export default function SuperAdminBids() {
  const [bids, setBids] = useState([]);
  const [sortedBids, setSortedBids] = useState([]);
  const [sortBy, setSortBy] = useState("price");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBids() {
      try {
        const res = await fetch("/api/superadmin/bids");
        const data = await res.json();

        if (data.success) {
          setBids(data.bids || []);
          setSortedBids(data.bids || []);
        } else {
          setError("Failed to fetch bids");
        }
      } catch (err) {
        setError("Error fetching data");
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBids();
  }, []);

  // Sorting function
  const handleSort = (key) => {
    setSortBy(key);
    const sorted = [...bids].sort((a, b) => {
      if (key === "price") return a.amount - b.amount;
      if (key === "rating") return b.truckerRating - a.truckerRating;
      if (key === "date") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });
    setSortedBids(sorted);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">
          📊 Monitor Bids
        </h1>

        {/* Sorting Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          {["price", "rating", "date"].map((key) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 ${
                sortBy === key
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
              onClick={() => handleSort(key)}
            >
              {key === "price"
                ? "Sort by Price"
                : key === "rating"
                ? "Sort by Rating"
                : "Sort by Date"}
            </button>
          ))}
        </div>

        {/* Show loading state */}
        {loading && (
          <p className="text-center text-gray-400 my-4">Loading bids...</p>
        )}

        {/* Show error message if API call fails */}
        {error && <p className="text-center text-red-400 my-4">{error}</p>}

        {/* Bids Table */}
        {!loading && !error && (
          <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="p-4">Load ID</th>
                  <th className="p-4">Shipper</th>
                  <th className="p-4">Trucker</th>
                  <th className="p-4">Bid Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedBids.length > 0 ? (
                  sortedBids.map((bid, index) => (
                    <tr
                      key={bid._id}
                      className="hover:bg-gray-750 transition-all"
                    >
                      <td className="p-4 text-gray-300">{bid.loadId}</td>
                      <td className="p-4 text-gray-300">{bid.shipperName}</td>
                      <td className="p-4 text-gray-300">{bid.truckerId}</td>
                      <td
                        className={`p-4 font-semibold ${
                          index === 0
                            ? "text-green-400 bg-green-900/30"
                            : "text-gray-300"
                        }`}
                      >
                        ${bid.amount}
                      </td>
                      <td className="p-4 text-gray-300">
                        {new Date(bid.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            bid.status === "accepted"
                              ? "bg-green-900/30 text-green-400"
                              : bid.status === "rejected"
                              ? "bg-red-900/30 text-red-400"
                              : "bg-blue-900/30 text-blue-400"
                          }`}
                        >
                          {bid.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-6 text-center text-gray-400 text-sm"
                    >
                      No bids found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}