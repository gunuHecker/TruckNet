// import { useRouter } from "next/navigation";
// import LogoutBtn from "@/components/LogoutBtn";

// export default function ShipperSidebar() {
//   const router = useRouter();

//   return (
//     <aside className="w-64 bg-gray-900 text-white p-6 min-h-screen flex flex-col justify-between">
//       <div>
//         <h2 className="text-xl font-bold mb-6">Shipper Panel</h2>
//         <nav>
//           <ul className="space-y-4">
//             <li
//               className="hover:text-blue-400 cursor-pointer"
//               onClick={() => router.push("/shipper/dashboard")}
//             >
//               Dashboard
//             </li>
//             <li
//               className="hover:text-blue-400 cursor-pointer"
//               onClick={() => router.push("/shipper/postLoad")}
//             >
//               Post Load
//             </li>
//             <li
//               className="hover:text-blue-400 cursor-pointer"
//               onClick={() => router.push("/shipper/myLoads")}
//             >
//               My Loads
//             </li>
//             <li
//               className="hover:text-blue-400 cursor-pointer"
//               onClick={() => router.push("/shipper/manageBids")}
//             >
//               Manage Bids
//             </li>
//             <li
//               className="hover:text-blue-400 cursor-pointer"
//               onClick={() => router.push("/shipper/financials")}
//             >
//               Payments
//             </li>
//           </ul>
//         </nav>
//       </div>
//       <LogoutBtn />
//     </aside>
//   );
// }

"use client";

import { useRouter, usePathname } from "next/navigation";
import LogoutBtn from "@/components/LogoutBtn";

export default function ShipperSidebar() {
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
        <h2 className="text-2xl font-bold mb-8 text-blue-400">Shipper Panel</h2>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-3">
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/shipper/dashboard")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/shipper/dashboard")}
            >
              Dashboard
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/shipper/postLoad")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/shipper/postLoad")}
            >
              Post Load
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/shipper/myLoads")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/shipper/myLoads")}
            >
              My Loads
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/shipper/openLoads")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/shipper/openLoads")}
            >
             Open Loads
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/shipper/manageBids")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/shipper/manageBids")}
            >
              Manage Bids
            </li>
            <li
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                isActive("/shipper/financials")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 hover:text-blue-400"
              }`}
              onClick={() => router.push("/shipper/financials")}
            >
              Payments
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