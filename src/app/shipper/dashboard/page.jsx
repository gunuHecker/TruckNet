"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  FiPlusCircle,
  FiClipboard,
  FiTruck,
  FiDollarSign,
  FiBell,
} from "react-icons/fi";

export default function ShipperDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    activeLoads: 0,
    pendingBids: 0,
    completedLoads: 0,
    totalPayments: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/shipper/dashboard");
      const data = await res.json();
      setStats(data.stats);
      setRecentActivity(data.recentActivity);
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Shipper Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li
              className="hover:text-blue-400 cursor-pointer"
              onClick={() => router.push("/shipper/postLoad")}
            >
              Post Load
            </li>
            <li
              className="hover:text-blue-400 cursor-pointer"
              onClick={() => router.push("/shipper/manageLoads")}
            >
              Manage Loads and Bids
            </li>
            <li
              className="hover:text-blue-400 cursor-pointer"
              onClick={() => router.push("/shipper/financials")}
            >
              Payments
            </li>
            <li
              className="hover:text-blue-400 cursor-pointer"
              onClick={() => router.push("/shipper/notifications")}
            >
              Notifications
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-black">Dashboard</h1>

        {/* Key Analytics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={<FiPlusCircle />}
            title="Active Loads"
            value={stats.activeLoads}
          />
          <StatCard
            icon={<FiClipboard />}
            title="Pending Bids"
            value={stats.pendingBids}
          />
          <StatCard
            icon={<FiTruck />}
            title="Completed Loads"
            value={stats.completedLoads}
          />
          <StatCard
            icon={<FiDollarSign />}
            title="Total Payments"
            value={`$${stats.totalPayments}`}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Recent Activity
          </h2>
          <ul className="space-y-3">
            {recentActivity.map((activity, index) => (
              <li key={index} className="text-gray-700 border-b pb-2">
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
      <div className="text-blue-500 text-3xl mr-4">{icon}</div>
      <div>
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
