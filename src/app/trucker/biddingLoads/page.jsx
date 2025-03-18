"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TruckerSidebar from "@/components/sidebars/TruckerSidebar";

export default function TruckerBiddingLoads() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [truckerId, setTruckerId] = useState(""); // Replace with actual trucker authentication data

  // Fetch user authentication details
    useEffect(() => {
      async function fetchAuthDetails() {
        try {
          const res = await fetch("/api/auth/check", {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (!data.success) return router.push("/login");
  
          setTruckerId(data.userId)
          console.log("data: ", data);
        } catch (error) {
          console.error("Error fetching auth details:", error);
          router.push("/login");
        }
      }
  
      fetchAuthDetails();
    }, []);

  useEffect(() => {
    async function fetchBiddingLoads() {
      try {
        const res = await fetch("/api/trucker/biddingLoads");
        const data = await res.json();
        if (data.success) {
          setLoads(data.loads);
        }
      } catch (error) {
        console.error("Error fetching bidding loads:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBiddingLoads();
  }, []);

  return (
    <div className="flex min-h-screen">
      <TruckerSidebar />

      <div className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Bidding Loads</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading loads...</p>
        ) : loads.length === 0 ? (
          <p className="text-center text-gray-400">
            No bidding loads available.
          </p>
        ) : (
          <div className="overflow-x-auto bg-gray-800 shadow-2xl rounded-lg p-6">
            <table className="w-full border-collapse">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="p-4 text-left">Pickup Location</th>
                  <th className="p-4 text-left">Drop-off Location</th>
                  <th className="p-4 text-left">Weight (kg)</th>
                  <th className="p-4 text-left">Truck Type</th>
                  <th className="p-4 text-left">Delivery Date</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loads.map((load) => (
                  <tr
                    key={load._id}
                    className="hover:bg-gray-750 transition-all"
                  >
                    <td className="p-4 text-gray-300">{load.pickupLocation}</td>
                    <td className="p-4 text-gray-300">
                      {load.dropoffLocation}
                    </td>
                    <td className="p-4 text-gray-300">{load.weight}</td>
                    <td className="p-4 text-gray-300">{load.truckType}</td>
                    <td className="p-4 text-gray-300">
                      {new Date(load.deliveryDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          router.push(
                            `/bidding/${load._id}?truckerName=${truckerId}`
                          )
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
                      >
                        Join Bidding
                      </button>
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
