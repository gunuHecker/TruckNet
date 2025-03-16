// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import TruckerSidebar from "@/components/sidebars/TruckerSidebar"; // Adjust path as needed

// export default function TruckerLoads() {
//   const [loads, setLoads] = useState([]);
//   const [filteredLoads, setFilteredLoads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Filter state variables
//   const [pickupLocation, setPickupLocation] = useState("");
//   const [dropoffLocation, setDropoffLocation] = useState("");
//   const [deadline, setDeadline] = useState("");
//   const [minWeight, setMinWeight] = useState("");
//   const [maxWeight, setMaxWeight] = useState("");

//   // Fetch loads
//   useEffect(() => {
//     async function fetchLoads() {
//       try {
//         const res = await fetch("/api/trucker/openLoads");
//         const data = await res.json();
//         if (data.success) {
//           setLoads(data.loads);
//           setFilteredLoads(data.loads); // Set initial filtered data
//         }
//       } catch (error) {
//         console.error("Error fetching loads:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchLoads();
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     let filtered = loads.filter((load) => {
//       return (
//         (pickupLocation
//           ? load.pickupLocation
//               .toLowerCase()
//               .includes(pickupLocation.toLowerCase())
//           : true) &&
//         (dropoffLocation
//           ? load.dropoffLocation
//               .toLowerCase()
//               .includes(dropoffLocation.toLowerCase())
//           : true) &&
//         (deadline ? new Date(load.deliveryDate) <= new Date(deadline) : true) &&
//         (minWeight ? load.weight >= parseFloat(minWeight) : true) &&
//         (maxWeight ? load.weight <= parseFloat(maxWeight) : true)
//       );
//     });

//     setFilteredLoads(filtered);
//   }, [pickupLocation, dropoffLocation, deadline, minWeight, maxWeight, loads]);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <TruckerSidebar />

//       {/* Main Content */}
//       <div className="flex-1 p-6 text-black">
//         <h1 className="text-3xl font-bold mb-4 text-gray-800">
//           Available Loads
//         </h1>

//         {/* Filter Section */}
//         <div className="bg-white p-4 rounded shadow-md mb-4">
//           <h2 className="text-xl font-semibold mb-2">Filter Loads</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <input
//               type="text"
//               placeholder="Pickup Location"
//               className="p-2 border rounded"
//               value={pickupLocation}
//               onChange={(e) => setPickupLocation(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Drop-off Location"
//               className="p-2 border rounded"
//               value={dropoffLocation}
//               onChange={(e) => setDropoffLocation(e.target.value)}
//             />
//             <input
//               type="date"
//               className="p-2 border rounded"
//               value={deadline}
//               onChange={(e) => setDeadline(e.target.value)}
//             />
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 placeholder="Min Weight"
//                 className="p-2 border rounded w-1/2"
//                 value={minWeight}
//                 onChange={(e) => setMinWeight(e.target.value)}
//               />
//               <input
//                 type="number"
//                 placeholder="Max Weight"
//                 className="p-2 border rounded w-1/2"
//                 value={maxWeight}
//                 onChange={(e) => setMaxWeight(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Load Table */}
//         {loading ? (
//           <p className="text-gray-700">Loading loads...</p>
//         ) : filteredLoads.length === 0 ? (
//           <p className="text-gray-700">No matching loads found.</p>
//         ) : (
//           <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
//             <table className="w-full border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-700">
//                   <th className="p-3 border">Pickup Location</th>
//                   <th className="p-3 border">Drop-off Location</th>
//                   <th className="p-3 border">Weight (kg)</th>
//                   <th className="p-3 border">Truck Type</th>
//                   <th className="p-3 border">Delivery Date</th>
//                   <th className="p-3 border">Status</th>
//                   <th className="p-3 border">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredLoads.map((load) => (
//                   <tr key={load._id} className="text-center border-t">
//                     <td className="p-3 border">{load.pickupLocation}</td>
//                     <td className="p-3 border">{load.dropoffLocation}</td>
//                     <td className="p-3 border">{load.weight}</td>
//                     <td className="p-3 border">{load.truckType}</td>
//                     <td className="p-3 border">
//                       {new Date(load.deliveryDate).toLocaleDateString()}
//                     </td>
//                     <td className="p-3 border font-semibold text-blue-600">
//                       {load.status}
//                     </td>
//                     <td className="p-3 border">
//                       <button
//                         onClick={() =>
//                           router.push(`/trucker/bidding/${load._id}`)
//                         }
//                         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
//                       >
//                         Bid Now
//                       </button>
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
import { useRouter } from "next/navigation";
import TruckerSidebar from "@/components/sidebars/TruckerSidebar"; // Adjust path as needed

export default function TruckerLoads() {
  const [loads, setLoads] = useState([]);
  const [filteredLoads, setFilteredLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Filter state variables
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");

  // Fetch loads
  useEffect(() => {
    async function fetchLoads() {
      try {
        const res = await fetch("/api/trucker/openLoads");
        const data = await res.json();
        if (data.success) {
          setLoads(data.loads);
          setFilteredLoads(data.loads); // Set initial filtered data
        }
      } catch (error) {
        console.error("Error fetching loads:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLoads();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = loads.filter((load) => {
      return (
        (pickupLocation
          ? load.pickupLocation
              .toLowerCase()
              .includes(pickupLocation.toLowerCase())
          : true) &&
        (dropoffLocation
          ? load.dropoffLocation
              .toLowerCase()
              .includes(dropoffLocation.toLowerCase())
          : true) &&
        (deadline ? new Date(load.deliveryDate) <= new Date(deadline) : true) &&
        (minWeight ? load.weight >= parseFloat(minWeight) : true) &&
        (maxWeight ? load.weight <= parseFloat(maxWeight) : true)
      );
    });

    setFilteredLoads(filtered);
  }, [pickupLocation, dropoffLocation, deadline, minWeight, maxWeight, loads]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <TruckerSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          Available Loads
        </h1>

        {/* Filter Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">
            Filter Loads
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Pickup Location"
              className="p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
            <input
              type="text"
              placeholder="Drop-off Location"
              className="p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            />
            <input
              type="date"
              className="p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Weight"
                className="p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-1/2 placeholder-gray-400"
                value={minWeight}
                onChange={(e) => setMinWeight(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max Weight"
                className="p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-1/2 placeholder-gray-400"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Load Table */}
        {loading ? (
          <p className="text-center text-gray-400">Loading loads...</p>
        ) : filteredLoads.length === 0 ? (
          <p className="text-center text-gray-400">No matching loads found.</p>
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
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLoads.map((load) => (
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
                    <td className="p-4 font-semibold text-blue-400">
                      {load.status}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          router.push(`/trucker/bidding/${load._id}`)
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
                      >
                        Bid Now
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