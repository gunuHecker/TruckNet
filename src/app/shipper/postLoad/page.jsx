// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import ShipperSidebar from "@/components/sidebars/ShipperSidebar"; // Import the sidebar component

// export default function PostLoad() {
//   const [formData, setFormData] = useState({
//     pickupLocation: "",
//     dropoffLocation: "",
//     weight: "",
//     truckType: "",
//     deliveryDate: "",
//   });

//   const router = useRouter();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/api/shipper/postLoad", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       if (res.ok) {
//         alert("Load posted successfully!");
//         router.push("/shipper/dashboard");
//       } else {
//         const errorData = await res.json();
//         alert(errorData.message || "Failed to post load");
//       }
//     } catch (error) {
//       console.error("Error posting load:", error);
//       alert("Error posting load");
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <ShipperSidebar />

//       {/* Main Content */}
//       <div className="flex-1 p-6 bg-gray-100 flex justify-center items-center text-black">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
//         >
//           <h2 className="text-2xl font-bold mb-4">Post a New Load</h2>

//           <label className="block mb-2">Pickup Location:</label>
//           <input
//             type="text"
//             name="pickupLocation"
//             value={formData.pickupLocation}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-4"
//             required
//           />

//           <label className="block mb-2">Dropoff Location:</label>
//           <input
//             type="text"
//             name="dropoffLocation"
//             value={formData.dropoffLocation}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-4"
//             required
//           />

//           <label className="block mb-2">Weight (kg):</label>
//           <input
//             type="number"
//             name="weight"
//             value={formData.weight}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-4"
//             required
//           />

//           <label className="block mb-2">Truck Type:</label>
//           <input
//             type="text"
//             name="truckType"
//             value={formData.truckType}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-4"
//             required
//           />

//           <label className="block mb-2">Delivery Date:</label>
//           <input
//             type="date"
//             name="deliveryDate"
//             value={formData.deliveryDate}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-4"
//             required
//           />

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//           >
//             Post Load
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ShipperSidebar from "@/components/sidebars/ShipperSidebar"; // Import the sidebar component

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <ShipperSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-900 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-2xl rounded-lg p-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-blue-400">
            Post a New Load
          </h2>

          {/* Pickup Location */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Pickup Location:</label>
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="Enter pickup location"
              required
            />
          </div>

          {/* Dropoff Location */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">
              Dropoff Location:
            </label>
            <input
              type="text"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="Enter dropoff location"
              required
            />
          </div>

          {/* Weight */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Weight (kg):</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="Enter weight"
              required
            />
          </div>

          {/* Truck Type */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Truck Type:</label>
            <input
              type="text"
              name="truckType"
              value={formData.truckType}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="Enter truck type"
              required
            />
          </div>

          {/* Delivery Date */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Delivery Date:</label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
          >
            Post Load
          </button>
        </form>
      </div>
    </div>
  );
}