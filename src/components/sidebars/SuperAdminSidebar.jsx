import { useRouter } from "next/navigation";

export default function SuperAdminSidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 min-h-screen">
      <h2 className="text-xl font-bold mb-6">SuperAdmin Panel</h2>
      <nav>
        <ul className="space-y-4">
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/superadmin/dashboard")}
          >
            Dashboard
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/superadmin/approvals")}
          >
            Approvals
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/superadmin/loads")}
          >
            Loads
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/superadmin/bids")}
          >
            Bids
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/superadmin/financials")}
          >
            Financials
          </li>
          <li
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => router.push("/superadmin/benefits")}
          >
            Benefits
          </li>
        </ul>
      </nav>
    </aside>
  );
}
