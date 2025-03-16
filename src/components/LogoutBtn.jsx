"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutBtn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/login"); // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-red-700 hover:to-red-600 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500"
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Logging out...
        </div>
      ) : (
        "Logout"
      )}
    </button>
  );
}