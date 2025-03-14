import { useRouter } from "next/navigation";

export default function TruckerSidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-6">Trucker Panel</h2>
      <nav>
        <ul className="space-y-4">
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/trucker/dashboard")}
          >
            Dashboard
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/trucker/loads")}
          >
            Available Loads
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/trucker/bids")}
          >
            My Bids
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/trucker/assignedLoads")}
          >
            Assigned Loads
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/trucker/payments")}
          >
            Payments
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/trucker/benefits")}
          >
            Claim Benefits
          </li>
        </ul>
      </nav>
    </aside>
  );
}
