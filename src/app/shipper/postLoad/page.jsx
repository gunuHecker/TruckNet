"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostLoad() {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    weight: "",
    truckType: "",
    deliveryDate: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/shipper/postLoad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Load posted successfully!");
        router.push("/shipper/dashboard");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to post load");
      }
    } catch (error) {
      console.error("Error posting load:", error);
      alert("Error posting load");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Post a New Load</h2>

        <label className="block mb-2">Pickup Location:</label>
        <input
          type="text"
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2">Dropoff Location:</label>
        <input
          type="text"
          name="dropoffLocation"
          value={formData.dropoffLocation}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2">Weight (kg):</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2">Truck Type:</label>
        <input
          type="text"
          name="truckType"
          value={formData.truckType}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2">Delivery Date:</label>
        <input
          type="date"
          name="deliveryDate"
          value={formData.deliveryDate}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Post Load
        </button>
      </form>
    </div>
  );
}
