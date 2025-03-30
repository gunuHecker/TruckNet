"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("shipper"); // Default role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Show loading state

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and userId in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // Redirect based on role
      if (role === "shipper") router.push("/shipper/dashboard");
      else if (role === "trucker") router.push("/trucker/dashboard");
      else if (role === "admin") router.push("/superadmin/dashboard");
    } catch (err) {
      setError(err.message); // Set error message
    } finally {
      setLoading(false); // Remove loading state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-gray-800 shadow-2xl rounded-xl p-8">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Login to <span className="text-blue-400">TruckNet</span>
          </h2>
          <p className="text-gray-300">
            Access your account to manage shipments, track loads, and streamline
            your freight operations.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-center mt-4 font-medium">{error}</p>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-5">
          {/* Role Dropdown */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Login as
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="shipper">Shipper</option>
              <option value="trucker">Trucker</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Don&#39;t have an account?{" "}
            <button
              onClick={() => {
                if (role === "shipper") router.push("/shipper/register");
                else if (role === "trucker") router.push("/trucker/register");
                else if (role === "admin") router.push("/superadmin/register");
              }}
              className="text-blue-400 font-semibold hover:underline focus:outline-none"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}