// 7️⃣ Trucker Benefits – /superadmin/benefits
// ✅ Purpose: Oversee trucker benefits (insurance, fuel discounts, etc.).
// 🔹 UI:

// List of available benefits
// Table of claimed benefits (Trucker, Type, Amount, Status)
// Approve / Reject Claim button

"use client";

import { useState, useEffect } from "react";
import SuperAdminSidebar from "@/components/sidebars/SuperAdminSidebar";

export default function SuperAdminBenifits() {
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">
          📊 Add Benifits
        </h1>
        
        {!error && (
          <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
            <h2>Under Production!!!</h2>
          </div>
        )}
      </main>
    </div>
  );
}