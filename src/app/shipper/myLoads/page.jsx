"use client";

import { useEffect, useState } from "react";
import ShipperSidebar from "@/components/sidebars/ShipperSidebar"; // Import the sidebar component

export default function MyLoads() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLoads() {
      try {
        const res = await fetch("/api/shipper/loads");
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch loads");
        }

        setLoads(data.loads);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLoads();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <ShipperSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 text-black">
        <h2 className="text-2xl font-semibold mb-4">My Loads</h2>

        {loading ? (
          <p className="text-center mt-4 text-gray-600">Loading loads...</p>
        ) : error ? (
          <p className="text-center mt-4 text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 border">Pickup Location</th>
                  <th className="p-2 border">Dropoff Location</th>
                  <th className="p-2 border">Weight</th>
                  <th className="p-2 border">Truck Type</th>
                  <th className="p-2 border">Delivery Date</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Assigned Trucker</th>
                  <th className="p-2 border">Tracking Status</th>
                  <th className="p-2 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {loads.map((load) => (
                  <tr key={load._id} className="border-b">
                    <td className="p-2 border">{load.pickupLocation}</td>
                    <td className="p-2 border">{load.dropoffLocation}</td>
                    <td className="p-2 border">{load.weight} kg</td>
                    <td className="p-2 border">{load.truckType}</td>
                    <td className="p-2 border">
                      {new Date(load.deliveryDate).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">{load.status}</td>
                    <td className="p-2 border">
                      {load.assignedTrucker?.name || "Not Assigned"}
                    </td>
                    <td className="p-2 border">
                      {load.assignedTrucker
                        ? load.trackingStatus
                        : "Not Assigned"}
                    </td>
                    <td className="p-2 border">
                      {new Date(load.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
