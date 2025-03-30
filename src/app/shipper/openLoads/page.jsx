"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ShipperSidebar from "@/components/sidebars/ShipperSidebar";

export default function ShipperOpenLoads() {
  const [loads, setLoads] = useState([]); // Ensure its always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchLoads() {
      try {
        const res = await fetch("/api/shipper/open-loads");
        const data = await res.json();
        // console.log("data is: ", data);
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch loads");
        }

        // Ensure `loads` is always an array
        setLoads(Array.isArray(data.openLoads) ? data.openLoads : []);
      } catch (err) {
        setError(err.message);
        setLoads([]); // Prevent undefined issues
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
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">Open Loads</h2>

        {loading ? (
          <p className="text-center mt-4 text-gray-400">Loading loads...</p>
        ) : error ? (
          <p className="text-center mt-4 text-red-400">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="p-4 text-left">Pickup Location</th>
                  <th className="p-4 text-left">Dropoff Location</th>
                  <th className="p-4 text-left">Weight</th>
                  <th className="p-4 text-left">Truck Type</th>
                  <th className="p-4 text-left">Delivery Date</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loads.length > 0 ? (
                  loads.map((load) => (
                    <tr
                      key={load._id}
                      className="hover:bg-gray-750 transition-all"
                    >
                      <td className="p-4 text-gray-300">
                        {load.pickupLocation}
                      </td>
                      <td className="p-4 text-gray-300">
                        {load.dropoffLocation}
                      </td>
                      <td className="p-4 text-gray-300">{load.weight} kg</td>
                      <td className="p-4 text-gray-300">{load.truckType}</td>
                      <td className="p-4 text-gray-300">
                        {new Date(load.deliveryDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition-all"
                          onClick={() => router.push(`/bidding/${load._id}`)}
                        >
                          Start Bidding
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-400">
                      No open loads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
