// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import TruckerSidebar from "@/components/sidebars/TruckerSidebar";
// import {
//   FiPackage,
//   FiClipboard,
//   FiCheckCircle,
//   FiDollarSign,
//   FiTruck,
// } from "react-icons/fi";

// export default function TruckerDashboard() {
//   const router = useRouter();
//   const [stats, setStats] = useState({
//     availableLoads: 0,
//     activeBids: 0,
//     assignedLoads: 0,
//     earnings: 0,
//     benefitsClaimed: 0,
//   });
//   const [recentActivity, setRecentActivity] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const res = await fetch("/api/trucker/dashboard");
//       const data = await res.json();
//       setStats(data.stats);
//       setRecentActivity(data.recentActivity);
//     }
//     fetchData();
//   }, []);

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <TruckerSidebar />

//       {/* Main Content */}
//       <main className="flex-1 p-8 bg-gray-100">
//         <h1 className="text-3xl font-bold mb-6 text-black">Dashboard</h1>

//         {/* Key Analytics Cards */}
//         <div className="grid grid-cols-5 gap-6 mb-6">
//           <StatCard
//             icon={<FiPackage />}
//             title="Available Loads"
//             value={stats.availableLoads}
//           />
//           <StatCard
//             icon={<FiClipboard />}
//             title="Active Bids"
//             value={stats.activeBids}
//           />
//           <StatCard
//             icon={<FiCheckCircle />}
//             title="Assigned Loads"
//             value={stats.assignedLoads}
//           />
//           <StatCard
//             icon={<FiDollarSign />}
//             title="Earnings"
//             value={`$${stats.earnings}`}
//           />
//           <StatCard
//             icon={<FiTruck />}
//             title="Benefits Claimed"
//             value={stats.benefitsClaimed}
//           />
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white p-6 shadow-lg rounded-lg">
//           <h2 className="text-xl font-semibold mb-4 text-black">
//             Recent Activity
//           </h2>
//           <ul className="space-y-3">
//             {recentActivity.map((activity, index) => (
//               <li key={index} className="text-gray-700 border-b pb-2">
//                 {activity}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </main>
//     </div>
//   );
// }

// function StatCard({ icon, title, value }) {
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
//       <div className="text-blue-500 text-3xl mr-4">{icon}</div>
//       <div>
//         <h3 className="text-lg font-medium text-gray-700">{title}</h3>
//         <p className="text-xl font-bold text-gray-900">{value}</p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TruckerSidebar from "@/components/sidebars/TruckerSidebar";
import {
  FiPackage,
  FiClipboard,
  FiCheckCircle,
  FiDollarSign,
  FiTruck,
} from "react-icons/fi";

export default function TruckerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    availableLoads: 0,
    activeBids: 0,
    assignedLoads: 0,
    earnings: 0,
    benefitsClaimed: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/trucker/dashboard");
      const data = await res.json();
      setStats(data.stats);
      setRecentActivity(data.recentActivity);
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <TruckerSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Dashboard</h1>

        {/* Key Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <StatCard
            icon={<FiPackage className="text-blue-400" />}
            title="Available Loads"
            value={stats.availableLoads}
          />
          <StatCard
            icon={<FiClipboard className="text-blue-400" />}
            title="Active Bids"
            value={stats.activeBids}
          />
          <StatCard
            icon={<FiCheckCircle className="text-blue-400" />}
            title="Assigned Loads"
            value={stats.assignedLoads}
          />
          <StatCard
            icon={<FiDollarSign className="text-blue-400" />}
            title="Earnings"
            value={`$${stats.earnings}`}
          />
          <StatCard
            icon={<FiTruck className="text-blue-400" />}
            title="Benefits Claimed"
            value={stats.benefitsClaimed}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 shadow-2xl rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">
            Recent Activity
          </h2>
          <ul className="space-y-3">
            {recentActivity.map((activity, index) => (
              <li
                key={index}
                className="text-gray-300 border-b border-gray-700 pb-2"
              >
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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
      <div className="flex items-center">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <h3 className="text-lg font-medium text-gray-300">{title}</h3>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}