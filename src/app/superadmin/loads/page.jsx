// 4️⃣ Manage Load Postings – /superadmin/loads
// ✅ Purpose: Monitor & oversee all load postings.
// 🔹 UI:

// Table of posted loads (Shipper, Route, Weight, Status, Bids, Assigned Trucker)
// Filters (Pending, Assigned, Completed)
// View Details button → Open detailed load modal

"use client";

import { useState, useEffect } from "react";
import SuperAdminSidebar from "@/components/sidebars/SuperAdminSidebar";

export default function SuperAdminLoads() {
  const [loads, setLoads] = useState([]);
  const [filteredLoads, setFilteredLoads] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedLoad, setSelectedLoad] = useState(null);

  useEffect(() => {
    async function fetchLoads() {
      const res = await fetch("/api/superadmin/loads");
      const data = await res.json();
      setLoads(data.loads);
      setFilteredLoads(data.loads);
    }
    fetchLoads();
  }, []);

  const applyFilter = (status) => {
    setSelectedFilter(status);
    if (status === "all") {
      setFilteredLoads(loads);
    } else {
      setFilteredLoads(loads.filter((load) => load.status === status));
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 text-black">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          🚛 Manage Load Postings
        </h1>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          {["all", "open", "bidding", "assigned", "completed"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-md transition duration-200 ${
                selectedFilter === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => applyFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Loads Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">Shipper</th>
                <th className="p-4">Route</th>
                <th className="p-4">Weight</th>
                <th className="p-4">Status</th>
                <th className="p-4">Bids</th>
                <th className="p-4">Assigned Trucker</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLoads.length > 0 ? (
                filteredLoads.map((load) => (
                  <tr key={load._id} className="hover:bg-gray-50 transition">
                    <td className="p-4">{load.shipperName}</td>
                    <td className="p-4">
                      {load.pickupLocation} → {load.dropoffLocation}
                    </td>
                    <td className="p-4">{load.weight} kg</td>
                    <td
                      className={`p-4 font-semibold ${
                        load.status === "completed"
                          ? "text-green-600"
                          : load.status === "assigned"
                          ? "text-blue-600"
                          : "text-orange-600"
                      }`}
                    >
                      {load.status}
                    </td>
                    <td className="p-4">{load.bids.length}</td>
                    <td className="p-4">
                      {load.assignedTrucker || "Not Assigned"}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                        onClick={() => setSelectedLoad(load)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No loads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Load Details Modal */}
        {selectedLoad && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">📦 Load Details</h2>
              <p className="mb-2">
                <strong>Shipper:</strong> {selectedLoad.shipperName}
              </p>
              <p className="mb-2">
                <strong>Route:</strong> {selectedLoad.pickupLocation} →{" "}
                {selectedLoad.dropoffLocation}
              </p>
              <p className="mb-2">
                <strong>Weight:</strong> {selectedLoad.weight} kg
              </p>
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    selectedLoad.status === "completed"
                      ? "text-green-600"
                      : selectedLoad.status === "assigned"
                      ? "text-blue-600"
                      : "text-orange-600"
                  }`}
                >
                  {selectedLoad.status}
                </span>
              </p>
              <p className="mb-2">
                <strong>Bids:</strong> {selectedLoad.bids.length}
              </p>
              <p className="mb-2">
                <strong>Assigned Trucker:</strong>{" "}
                {selectedLoad.assignedTrucker || "Not Assigned"}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  onClick={() => setSelectedLoad(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
