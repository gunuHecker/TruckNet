// "use client";

// import { useEffect, useState } from "react";
// import ShipperSidebar from "@/components/sidebars/ShipperSidebar"; // Import the sidebar component

// export default function MyLoads() {
//   const [loads, setLoads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchLoads() {
//       try {
//         const res = await fetch("/api/shipper/loads");
//         const data = await res.json();

//         if (!data.success) {
//           throw new Error(data.message || "Failed to fetch loads");
//         }

//         setLoads(data.loads);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchLoads();
//   }, []);

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <ShipperSidebar />

//       {/* Main Content */}
//       <div className="flex-1 p-6 bg-gray-100 text-black">
//         <h2 className="text-2xl font-semibold mb-4">My Loads</h2>

//         {loading ? (
//           <p className="text-center mt-4 text-gray-600">Loading loads...</p>
//         ) : error ? (
//           <p className="text-center mt-4 text-red-500">{error}</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
//               <thead>
//                 <tr className="bg-gray-100 border-b">
//                   <th className="p-2 border">Pickup Location</th>
//                   <th className="p-2 border">Dropoff Location</th>
//                   <th className="p-2 border">Weight</th>
//                   <th className="p-2 border">Truck Type</th>
//                   <th className="p-2 border">Delivery Date</th>
//                   <th className="p-2 border">Status</th>
//                   <th className="p-2 border">Assigned Trucker</th>
//                   <th className="p-2 border">Tracking Status</th>
//                   <th className="p-2 border">Created At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loads.map((load) => (
//                   <tr key={load._id} className="border-b">
//                     <td className="p-2 border">{load.pickupLocation}</td>
//                     <td className="p-2 border">{load.dropoffLocation}</td>
//                     <td className="p-2 border">{load.weight} kg</td>
//                     <td className="p-2 border">{load.truckType}</td>
//                     <td className="p-2 border">
//                       {new Date(load.deliveryDate).toLocaleDateString()}
//                     </td>
//                     <td className="p-2 border">{load.status}</td>
//                     <td className="p-2 border">
//                       {load.assignedTrucker?.name || "Not Assigned"}
//                     </td>
//                     <td className="p-2 border">
//                       {load.assignedTrucker
//                         ? load.trackingStatus
//                         : "Not Assigned"}
//                     </td>
//                     <td className="p-2 border">
//                       {new Date(load.createdAt).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import ShipperSidebar from "@/components/sidebars/ShipperSidebar"; // Import the sidebar component

export default function MyLoads() {
  const [loads, setLoads] = useState([]);
  const [filteredLoads, setFilteredLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    async function fetchLoads() {
      try {
        const res = await fetch("/api/shipper/loads");
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch loads");
        }

        setLoads(data.loads);
        setFilteredLoads(data.loads); // Initialize filtered loads
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLoads();
  }, []);

  // Apply filter based on selected status
  const applyFilter = (status) => {
    setSelectedFilter(status);
    if (status === "all") {
      setFilteredLoads(loads);
    } else {
      setFilteredLoads(loads.filter((load) => load.status === status));
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <ShipperSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">My Loads</h2>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          {["all", "assigned", "completed"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 ${
                selectedFilter === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
              onClick={() => applyFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

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
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Assigned Trucker</th>
                  <th className="p-4 text-left">Tracking Status</th>
                  <th className="p-4 text-left">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLoads.length > 0 ? (
                  filteredLoads.map((load) => (
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
                      <td
                        className={`p-4 font-semibold ${
                          load.status === "completed"
                            ? "text-green-400"
                            : load.status === "assigned"
                            ? "text-blue-400"
                            : "text-orange-400"
                        }`}
                      >
                        {load.status}
                      </td>
                      <td className="p-4 text-gray-300">
                        {load.assignedTrucker?.name || "Not Assigned"}
                      </td>
                      <td className="p-4 text-gray-300">
                        {load.assignedTrucker
                          ? load.trackingStatus
                          : "Not Assigned"}
                      </td>
                      <td className="p-4 text-gray-300">
                        {new Date(load.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-6 text-center text-gray-400">
                      No loads found.
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