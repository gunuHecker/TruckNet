// 5️⃣ Monitor Bids – /superadmin/bids
// ✅ Purpose: Track & oversee trucker bids on loads.
// 🔹 UI:

// Table with columns (Load ID, Shipper, Trucker, Bid Amount, Status)
// Lowest bid highlighted
// Sort by price, trucker rating, date
// Action buttons (Accept, Reject, View Trucker Profile)

"use client";

import { useState, useEffect } from "react";

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
          setBids(data.bids || []); // Ensure it's an array
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
      if (key === "price") return a.bidAmount - b.bidAmount;
      if (key === "rating") return b.truckerRating - a.truckerRating;
      if (key === "date") return new Date(a.date) - new Date(b.date);
      return 0;
    });
    setSortedBids(sorted);
  };

  return (
    <div className="text-black p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">📊 Monitor Bids</h1>

      {/* Sorting Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        {["price", "rating", "date"].map((key) => (
          <button
            key={key}
            className={`px-4 py-2 rounded-md transition duration-200 ${
              sortBy === key
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 hover:bg-gray-300"
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
        <p className="text-center text-gray-500 my-4">Loading bids...</p>
      )}

      {/* Show error message if API call fails */}
      {error && <p className="text-center text-red-500 my-4">{error}</p>}

      {/* Bids Table */}
      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">Load ID</th>
                <th className="p-4">Shipper ID</th>
                <th className="p-4">Trucker ID</th>
                <th className="p-4">Bid Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedBids.length > 0 ? (
                sortedBids.map((bid, index) => (
                  <tr key={bid._id} className="hover:bg-gray-50 transition">
                    <td className="p-4">{bid.loadId}</td>
                    <td className="p-4">{bid.shipperName}</td>
                    <td className="p-4">{bid.truckerId}</td>
                    <td
                      className={`p-4 font-semibold ${
                        index === 0 ? "text-green-600 bg-green-100" : ""
                      }`}
                    >
                      ${bid.amount}
                    </td>
                    <td className="p-4">
                      {new Date(bid.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center space-x-2">
                      {bid.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No bids found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}