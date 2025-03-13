// // ✅ Purpose: Verify & approve admins, shippers, truckers.
// // 🔹 UI:

// // Table listing pending approvals
// // Each row shows user details & eligibility criteria (for truckers)
// // Approve / Reject buttons
// // 🔹 Features:
// // Eligibility check for truckers (No accidents, truck age, etc.)
// // Email notification on approval/rejection

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function Approvals() {
//   const [pendingApprovals, setPendingApprovals] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     // Fetch pending approvals from API
//     async function fetchApprovals() {
//       try {
//         const res = await fetch("/api/superadmin/approvals");
//         const data = await res.json();
//         setPendingApprovals(data.pendingApprovals || []);
//       } catch (error) {
//         console.error("Error fetching approvals:", error);
//       }
//     }
//     fetchApprovals();
//   }, []);

//   // Approve user
//   async function handleApprove(userId) {
//     try {
//       const res = await fetch(`/api/superadmin/approvals/approve`, {
//         method: "POST",
//         body: JSON.stringify({ userId }),
//         headers: { "Content-Type": "application/json" },
//       });

//       if (res.ok) {
//         setPendingApprovals(
//           pendingApprovals.filter((user) => user._id !== userId)
//         );
//         alert("User approved successfully!");
//       } else {
//         alert("Failed to approve user.");
//       }
//     } catch (error) {
//       console.error("Error approving user:", error);
//     }
//   }

//   // Reject user
//   async function handleReject(userId) {
//     try {
//       const res = await fetch(`/api/superadmin/approvals/reject`, {
//         method: "POST",
//         body: JSON.stringify({ userId }),
//         headers: { "Content-Type": "application/json" },
//       });

//       if (res.ok) {
//         setPendingApprovals(
//           pendingApprovals.filter((user) => user._id !== userId)
//         );
//         alert("User rejected successfully!");
//       } else {
//         alert("Failed to reject user.");
//       }
//     } catch (error) {
//       console.error("Error rejecting user:", error);
//     }
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-bold mb-4 text-black">Pending Approvals</h2>

//       <div className="bg-white shadow-md rounded-lg p-4">
//         <table className="w-full border-collapse text-">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-3 text-left text-black">Name</th>
//               <th className="p-3 text-left text-black">Email</th>
//               <th className="p-3 text-left text-black">Role</th>
//               <th className="p-3 text-left text-black">
//                 Eligibility (Truckers)
//               </th>
//               <th className="p-3 text-center text-black">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pendingApprovals.length > 0 ? (
//               pendingApprovals.map((user) => (
//                 <tr key={user._id} className="border-b">
//                   <td className="p-3">{user.name}</td>
//                   <td className="p-3">{user.email}</td>
//                   <td className="p-3 capitalize">{user.role}</td>
//                   <td className="p-3">
//                     {user.role === "trucker" ? (
//                       <ul className="list-disc pl-5 text-sm">
//                         <li>
//                           Accidents:{" "}
//                           {user.eligibility.accidents === 0 ? "✅" : "❌"}
//                         </li>
//                         <li>
//                           Valid License:{" "}
//                           {user.eligibility.licenseValid ? "✅" : "❌"}
//                         </li>
//                         <li>Truck Age: {user.eligibility.truckAge} years</li>
//                         <li>
//                           Trucker Age: {user.eligibility.truckerAge} years
//                         </li>
//                       </ul>
//                     ) : (
//                       "N/A"
//                     )}
//                   </td>
//                   <td className="p-3 flex justify-center gap-2">
//                     <button
//                       className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                       onClick={() => handleApprove(user._id)}
//                     >
//                       Approve
//                     </button>
//                     <button
//                       className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                       onClick={() => handleReject(user._id)}
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center p-4 text-gray-500">
//                   No pending approvals.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Approvals() {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch pending approvals from API
    async function fetchApprovals() {
      try {
        const res = await fetch("/api/superadmin/approvals");
        const data = await res.json();
        setPendingApprovals(data.pendingApprovals || []);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      }
    }
    fetchApprovals();
  }, []);

  // Approve user
  async function handleApprove(userId) {
    try {
      const res = await fetch(`/api/superadmin/approvals/approve`, {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setPendingApprovals(
          pendingApprovals.filter((user) => user._id !== userId)
        );
        alert("User approved successfully!");
      } else {
        alert("Failed to approve user.");
      }
    } catch (error) {
      console.error("Error approving user:", error);
    }
  }

  // Reject user
  async function handleReject(userId) {
    try {
      const res = await fetch(`/api/superadmin/approvals/reject`, {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setPendingApprovals(
          pendingApprovals.filter((user) => user._id !== userId)
        );
        alert("User rejected successfully!");
      } else {
        alert("Failed to reject user.");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-black">Pending Approvals</h2>

      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse text-sm text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left text-black">Name</th>
              <th className="p-3 text-left text-black">Email</th>
              <th className="p-3 text-left text-black">Role</th>
              <th className="p-3 text-left text-black">
                Eligibility (Truckers)
              </th>
              <th className="p-3 text-center text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    {user.role === "trucker" && user.truckerDetails ? (
                      <ul className="list-disc pl-5 text-sm">
                        <li>
                          Accidents:{" "}
                          {user.truckerDetails.accidentHistory ? "Accidents!! ❌" : "No accidents ✅"}
                        </li>
                        <li>
                          Theft Complaints:{" "}
                          {user.truckerDetails.theftComplaints ? "Theif!! ❌" : "Clean ✅"}
                        </li>
                        <li>
                          Truck Age: {user.truckerDetails.truckAge} years (≤ 5
                          ✅)
                        </li>
                        <li>
                          License Duration:{" "}
                          {user.truckerDetails.licenseDuration} years (≥ 5 ✅)
                        </li>
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleReject(user._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No pending approvals.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
