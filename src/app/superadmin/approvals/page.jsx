"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SuperAdminSidebar from "@/components/sidebars/SuperAdminSidebar";

export default function Approvals() {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const router = useRouter();

  useEffect(() => {
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">
          Pending Approvals
        </h2>

        <div className="bg-gray-800 shadow-2xl rounded-lg p-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-left text-gray-300">Name</th>
                <th className="p-3 text-left text-gray-300">Email</th>
                <th className="p-3 text-left text-gray-300">Role</th>
                <th className="p-3 text-left text-gray-300">
                  Eligibility (Truckers)
                </th>
                <th className="p-3 text-center text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((user) => (
                  <tr key={user._id} className="border-b border-gray-700">
                    <td className="p-3 text-gray-300">{user.name}</td>
                    <td className="p-3 text-gray-300">{user.email}</td>
                    <td className="p-3 text-gray-300 capitalize">
                      {user.role}
                    </td>
                    <td className="p-3 text-gray-300">
                      {user.role === "trucker" && user.truckerDetails ? (
                        <ul className="list-disc pl-5 text-sm">
                          <li>
                            Accidents:{" "}
                            {user.truckerDetails.accidentHistory
                              ? "Accidents!! ❌"
                              : "No accidents ✅"}
                          </li>
                          <li>
                            Theft Complaints:{" "}
                            {user.truckerDetails.theftComplaints
                              ? "Theif!! ❌"
                              : "Clean ✅"}
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
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95"
                        onClick={() => handleApprove(user._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 active:scale-95"
                        onClick={() => handleReject(user._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-4 text-gray-400 text-sm"
                  >
                    No pending approvals.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}