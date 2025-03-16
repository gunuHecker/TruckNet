// "use client";

// import { useState, useEffect } from "react";
// import TruckerSidebar from "@/components/sidebars/TruckerSidebar"; // Import the sidebar

// export default function AssignedLoads() {
//   const [assignedLoads, setAssignedLoads] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchAssignedLoads() {
//       try {
//         const res = await fetch("/api/trucker/assignedLoads");
//         const data = await res.json();

//         if (res.ok) {
//           setAssignedLoads(data.assignedLoads);
//         } else {
//           console.error("Error fetching loads:", data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching loads:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAssignedLoads();
//   }, []);

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <TruckerSidebar />

//       {/* Main Content */}
//       <main className="flex-1 p-6 bg-gray-100 text-black">
//         <h1 className="text-3xl font-bold mb-6 text-black">Assigned Loads</h1>

//         {loading ? (
//           <p className="text-gray-600">Loading assigned loads...</p>
//         ) : assignedLoads.length === 0 ? (
//           <p className="text-gray-600">No assigned loads found.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {assignedLoads.map((load) => (
//               <LoadCard key={load._id} load={load} />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// function LoadCard({ load }) {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-2">
//         {load.pickupLocation} → {load.dropoffLocation}
//       </h2>
//       <p className="text-gray-700 mb-1">
//         Status: <span className="font-medium text-blue-600">{load.status}</span>
//       </p>
//       <p className="text-gray-700 mb-1">
//         Pickup Date: {new Date(load.pickupDate).toLocaleDateString()}
//       </p>
//       <p className="text-gray-700 mb-1">Weight: {load.weight} kg</p>
//       <p className="text-gray-700 mb-1">Price: ${load.price}</p>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import TruckerSidebar from "@/components/sidebars/TruckerSidebar"; // Import the sidebar

export default function AssignedLoads() {
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <TruckerSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          Assigned Loads
        </h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading assigned loads...</p>
        ) : assignedLoads.length === 0 ? (
          <p className="text-center text-gray-400">No assigned loads found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedLoads.map((load) => (
              <LoadCard key={load._id} load={load} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function LoadCard({ load }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl hover:shadow-xl transition-all transform hover:scale-105">
      <h2 className="text-xl font-bold text-blue-400">
        {load.pickupLocation} → {load.dropoffLocation}
      </h2>
      <div className="mt-4 space-y-2 text-gray-300">
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`font-semibold ${
              load.status === "completed"
                ? "text-green-400"
                : load.status === "assigned"
                ? "text-blue-400"
                : "text-orange-400"
            }`}
          >
            {load.status}
          </span>
        </p>
        <p>
          <strong>Pickup Date:</strong>{" "}
          {new Date(load.pickupDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Weight:</strong> {load.weight} kg
        </p>
        <p>
          <strong>Price:</strong> ${load.price}
        </p>
      </div>
    </div>
  );
}