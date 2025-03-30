"use client"; // Required for client-side navigation

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center px-6 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to <span className="text-blue-400">TruckNet</span> 🚛
        </h1>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
          TruckNet is your ultimate platform for connecting{" "}
          <strong className="font-semibold text-white">Shippers</strong> and{" "}
          <strong className="font-semibold text-white">Truckers</strong>.
          Streamline your freight management with tools to post loads, bid, and
          track shipments seamlessly.
        </p>
      </div>

      {/* Image Section */}
      <div className="mb-12">
        <Image
          src="/trucknet-hero.jpg" // Add your image to the public folder
          width={500}
          height={300}
          alt="TruckNet Platform"
          className="rounded-xl shadow-2xl border-4 border-gray-700"
          priority
        />
      </div>

      {/* Call-to-Action Section */}
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Get Started with TruckNet
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Join TruckNet today to experience a smarter way to manage freight.
          Whether you&#39;re a shipper or a trucker, we&#39;ve got you covered.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <button
            onClick={() => router.push("/shipper/register")}
            className="px-8 py-3 text-lg font-semibold bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600 transition-all transform hover:scale-105 active:scale-95 border border-gray-600"
          >
            Register as Shipper
          </button>
          <button
            onClick={() => router.push("/trucker/register")}
            className="px-8 py-3 text-lg font-semibold bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600 transition-all transform hover:scale-105 active:scale-95 border border-gray-600"
          >
            Register as Trucker
          </button>
        </div>

        {/* Login & Admin Section */}
        <div className="mt-6">
          <p className="text-gray-300 mb-4">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-400 font-semibold hover:underline focus:outline-none"
            >
              Login here
            </button>
          </p>
          <p className="text-gray-300">
            Interested in becoming an admin?{" "}
            <button
              onClick={() => router.push("/superadmin/register")}
              className="text-blue-400 font-semibold hover:underline focus:outline-none"
            >
              Register as Admin
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
