"use client";

import { useState, useEffect } from "react";

export default function TruckerProfile() {
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold text-blue-400 mb-6">
            Trucker Profile
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