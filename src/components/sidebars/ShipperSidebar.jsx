import { useRouter } from "next/navigation";

export default function ShipperSidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-6">Shipper Panel</h2>
      <nav>
        <ul className="space-y-4">
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/shipper/dashboard")}
          >
            Dashboard
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/shipper/postLoad")}
          >
            Post Load
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/shipper/myLoads")}
          >
            My Loads
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/shipper/manageBids")}
          >
            Manage Bids
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/shipper/financials")}
          >
            Payments
          </li>
        </ul>
      </nav>
    </aside>
  );
}
