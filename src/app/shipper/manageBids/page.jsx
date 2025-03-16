// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import ShipperSidebar from "@/components/sidebars/ShipperSidebar"; // Importing sidebar

// export default function ManageBids() {
//   const [loads, setLoads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all"); // Filter state

//   useEffect(() => {
//     fetchBids();
//   }, []);

//   const fetchBids = async () => {
//     try {
//       const response = await axios.get("/api/shipper/manageBids");
//       if (response.data.success) {
//         setLoads(response.data.loads);
//       }
//     } catch (error) {
//       console.error("Error fetching bids:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBidAction = async (bidId, status) => {
//     try {
//       const response = await axios.post("/api/shipper/updateBid", {
//         bidId,
//         status,
//       });
//       if (response.data.success) {
//         fetchBids(); // Refresh bids after update
//       }
//     } catch (error) {
//       console.error("Error updating bid:", error);
//     }
//   };

//   const filteredLoads = loads.map((load) => ({
//     ...load,
//     bids: load.bids.filter((bid) =>
//       filter === "all" ? true : bid.status === filter
//     ),
//   }));

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <ShipperSidebar />

//       {/* Main Content */}
//       <div className="flex-1 p-6 text-gray-900">
//         <h1 className="text-2xl font-semibold mb-4">Manage Bids</h1>

//         {/* Filter Dropdown */}
//         <div className="mb-4">
//           <label className="mr-2 font-medium">Filter Bids:</label>
//           <select
//             className="border p-2 rounded"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//           >
//             <option value="all">All</option>
//             <option value="pending">Pending</option>
//             <option value="accepted">Accepted</option>
//             <option value="rejected">Rejected</option>
//           </select>
//         </div>

//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <div className="space-y-6">
//             {filteredLoads.length === 0 ? (
//               <p>No bids found.</p>
//             ) : (
//               filteredLoads.map((load) => (
//                 <div
//                   key={load._id}
//                   className="border p-4 rounded-lg shadow-md bg-white"
//                 >
//                   <h2 className="text-lg font-bold">
//                     Load: {load.pickupLocation} → {load.dropoffLocation}
//                   </h2>
//                   <p>
//                     <strong>Weight:</strong> {load.weight} kg
//                   </p>
//                   <p>
//                     <strong>Truck Type:</strong> {load.truckType}
//                   </p>
//                   <p>
//                     <strong>Status:</strong> {load.status}
//                   </p>

//                   <h3 className="mt-3 font-semibold">Bids:</h3>
//                   {load.bids.length === 0 ? (
//                     <p>No bids yet.</p>
//                   ) : (
//                     <table className="w-full mt-2 border">
//                       <thead>
//                         <tr className="bg-gray-200 text-black">
//                           <th className="p-2 border">Trucker</th>
//                           <th className="p-2 border">Amount</th>
//                           <th className="p-2 border">Status</th>
//                           <th className="p-2 border">Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {load.bids.map((bid) => (
//                           <tr key={bid._id} className="text-center">
//                             <td className="p-2 border">
//                               {bid.truckerId?.name || "N/A"}
//                             </td>
//                             <td className="p-2 border">${bid.amount}</td>
//                             <td className="p-2 border">
//                               <span
//                                 className={`px-2 py-1 text-white text-sm rounded ${
//                                   bid.status === "pending"
//                                     ? "bg-yellow-500"
//                                     : bid.status === "accepted"
//                                     ? "bg-green-500"
//                                     : "bg-red-500"
//                                 }`}
//                               >
//                                 {bid.status}
//                               </span>
//                             </td>
//                             <td className="p-2 border">
//                               {bid.status === "pending" && (
//                                 <div className="flex gap-2 justify-center">
//                                   <button
//                                     onClick={() =>
//                                       handleBidAction(bid._id, "accepted")
//                                     }
//                                     className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                                   >
//                                     Accept
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleBidAction(bid._id, "rejected")
//                                     }
//                                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                                   >
//                                     Reject
//                                   </button>
//                                 </div>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ShipperSidebar from "@/components/sidebars/ShipperSidebar"; // Importing sidebar

export default function ManageBids() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <ShipperSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">Manage Bids</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading bids...</p>
        ) : (
          <div className="space-y-6">
            {loads.length === 0 ? (
              <p className="text-center text-gray-400">No bids found.</p>
            ) : (
              loads.map((load) => (
                <div
                  key={load._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-2xl"
                >
                  <h2 className="text-lg font-bold text-blue-400">
                    Load: {load.pickupLocation} → {load.dropoffLocation}
                  </h2>
                  <div className="mt-2 space-y-2 text-gray-300">
                    <p>
                      <strong>Weight:</strong> {load.weight} kg
                    </p>
                    <p>
                      <strong>Truck Type:</strong> {load.truckType}
                    </p>
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
                  </div>

                  <h3 className="mt-4 font-semibold text-blue-400">Bids:</h3>
                  {load.bids.length === 0 ? (
                    <p className="text-gray-400">No bids yet.</p>
                  ) : (
                    <table className="w-full mt-2 border-collapse">
                      <thead className="bg-gray-700 text-gray-300">
                        <tr>
                          <th className="p-2 text-left">Trucker</th>
                          <th className="p-2 text-left">Amount</th>
                          <th className="p-2 text-left">Status</th>
                          <th className="p-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {load.bids.map((bid) => (
                          <tr key={bid._id} className="hover:bg-gray-750">
                            <td className="p-2 text-gray-300">
                              {bid.truckerId?.name || "N/A"}
                            </td>
                            <td className="p-2 text-gray-300">${bid.amount}</td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 text-sm rounded ${
                                  bid.status === "pending"
                                    ? "bg-yellow-500 text-white"
                                    : bid.status === "accepted"
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                              >
                                {bid.status}
                              </span>
                            </td>
                            <td className="p-2">
                              {bid.status === "pending" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleBidAction(bid._id, "accepted")
                                    }
                                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleBidAction(bid._id, "rejected")
                                    }
                                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 active:scale-95"
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