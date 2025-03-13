"use client"; // Required for client-side navigation

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      {/* Hero Section */}
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">TruckNet</span> 🚛
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Connecting <strong>Shippers</strong> and <strong>Truckers</strong> for
          a smarter, more efficient freight management experience. Post loads,
          bid, and track shipments with ease!
        </p>
      </div>

      {/* Image Section */}
      <div className="mt-8">
        <Image
          src="/trucknet-hero.jpg" // Add your image to the public folder
          width={500}
          height={300}
          alt="TruckNet Platform"
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => router.push("/shipper/register")}
          className="px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Register as Shipper
        </button>
        <button
          onClick={() => router.push("/trucker/register")}
          className="px-6 py-3 text-lg font-semibold bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all"
        >
          Register as Trucker
        </button>
      </div>

      {/* Login & Admin Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 text-lg font-semibold bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900 transition-all"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/superadmin/register")}
          className="px-6 py-3 text-lg font-semibold bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
        >
          Become Admin
        </button>
      </div>
    </div>
  );
}
