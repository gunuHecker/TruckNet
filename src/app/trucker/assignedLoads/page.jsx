"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AssignedLoads() {
  const router = useRouter();
  const [assignedLoads, setAssignedLoads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignedLoads() {
      try {
        const res = await fetch("/api/trucker/assignedLoads");
        const data = await res.json();

        if (res.ok) {
          setAssignedLoads(data.assignedLoads);
        } else {
          console.error("Error fetching loads:", data.message);
        }
      } catch (error) {
        console.error("Error fetching loads:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAssignedLoads();
  }, []);

  return (
    <div className="text-black min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Assigned Loads</h1>

      {loading ? (
        <p className="text-gray-600">Loading assigned loads...</p>
      ) : assignedLoads.length === 0 ? (
        <p className="text-gray-600">No assigned loads found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedLoads.map((load) => (
            <LoadCard key={load._id} load={load} />
          ))}
        </div>
      )}
    </div>
  );
}

function LoadCard({ load }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">
        {load.pickupLocation} → {load.dropoffLocation}
      </h2>
      <p className="text-gray-700 mb-1">
        Status: <span className="font-medium text-blue-600">{load.status}</span>
      </p>
      <p className="text-gray-700 mb-1">
        Pickup Date: {new Date(load.pickupDate).toLocaleDateString()}
      </p>
      <p className="text-gray-700 mb-1">Weight: {load.weight} kg</p>
      <p className="text-gray-700 mb-1">Price: ${load.price}</p>
    </div>
  );
}
