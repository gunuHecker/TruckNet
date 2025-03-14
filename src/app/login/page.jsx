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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Login to <span className="text-blue-600">TruckNet</span>
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Login as
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
              <option value="shipper">Shipper</option>
              <option value="trucker">Trucker</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-4 text-gray-600 text-center">
          Don't have an account?
          <span
            className="text-blue-500 font-medium cursor-pointer hover:underline ml-1"
            onClick={() => {
              if (role === "shipper") router.push("/shipper/register");
              else if (role === "trucker") router.push("/trucker/register");
              else if (role === "admin") router.push("/superadmin/register");
            }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
