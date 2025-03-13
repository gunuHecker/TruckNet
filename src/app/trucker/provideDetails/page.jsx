"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProvideDetails() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    truckNumber: "",
    licenseNumber: "",
    truckAge: "",
    accidentHistory: false,
    theftComplaints: false,
    licenseDuration: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("/api/trucker/provideDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Details submitted successfully!");
        router.replace("/login")
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting details:", error);
      setMessage("❌ Failed to submit details.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          🚛 Provide Trucker Details
        </h2>

        {message && (
          <p className="mb-4 text-center font-medium text-lg text-green-600">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Truck Number */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Truck Number
            </label>
            <input
              type="text"
              name="truckNumber"
              value={formData.truckNumber}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* License Number */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              License Number
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Truck Age */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Truck Age (Years)
            </label>
            <input
              type="number"
              name="truckAge"
              value={formData.truckAge}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Accident History - Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 font-semibold">
              Has Accident History?
            </label>
            <input
              type="checkbox"
              name="accidentHistory"
              checked={formData.accidentHistory}
              onChange={handleChange}
              className="w-5 h-5 accent-red-500"
            />
          </div>

          {/* Theft Complaints - Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 font-semibold">
              Has Theft Complaints?
            </label>
            <input
              type="checkbox"
              name="theftComplaints"
              checked={formData.theftComplaints}
              onChange={handleChange}
              className="w-5 h-5 accent-red-500"
            />
          </div>

          {/* License Duration */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              License Duration (Years)
            </label>
            <input
              type="number"
              name="licenseDuration"
              value={formData.licenseDuration}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            Submit Details
          </button>
        </form>
      </div>
    </div>
  );
}
