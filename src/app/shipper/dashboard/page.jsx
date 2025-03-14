"use client";

import { useState, useEffect } from "react";
import {
  FiPlusCircle,
  FiClipboard,
  FiTruck,
  FiDollarSign,
} from "react-icons/fi";
import ShipperSidebar from "@/components/sidebars/ShipperSidebar"; // Import Sidebar Component

export default function ShipperDashboard() {
  const [stats, setStats] = useState({
    activeLoads: 0,
    pendingBidsCount: 0,
    completedLoads: 0,
    totalPayments: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/shipper/dashboard");
        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
          setRecentActivity(data.recentActivity);
        } else {
          console.error("Failed to fetch dashboard data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <ShipperSidebar />
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
            value={stats.pendingBidsCount}
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <li key={index} className="text-gray-700 border-b pb-2">
                  {activity}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No recent activity.</li>
            )}
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
