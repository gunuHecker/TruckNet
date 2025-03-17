"use client";

import { useRouter, usePathname } from "next/navigation";
import LogoutBtn from "@/components/LogoutBtn";

export default function TruckerSidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  // Function to check if a link is active
  const isActive = (route) => {
    return pathname === route;
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-6 min-h-screen flex flex-col justify-between">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-8 text-blue-400">Trucker Panel</h2>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-3">
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/trucker/dashboard")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/trucker/dashboard")}
            >
              Dashboard
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/trucker/loads")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/trucker/loads")}
            >
              Available Loads
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/trucker/biddingLoads")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/trucker/biddingLoads")}
            >
              Bidding Loads
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/trucker/bids")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/trucker/bids")}
            >
              My Bids
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/trucker/assignedLoads")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/trucker/assignedLoads")}
            >
              Assigned Loads
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/trucker/provideDetails")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/trucker/provideDetails")}
            >
              Provide Details
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/trucker/payments")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/trucker/payments")}
            >
              Payments
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/trucker/benefits")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/trucker/benefits")}
            >
              Claim Benefits
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <LogoutBtn />
      </div>
    </aside>
  );
}