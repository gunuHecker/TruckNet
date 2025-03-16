// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// const SuperAdminRegister = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/auth/superadmin/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (!res.ok)
//         throw new Error(data.error || data.message || "Registration failed");

//       alert("SuperAdmin registered successfully!");
//       router.replace("/login"); // Use replace() instead of push()
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="text-black flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-bold text-center text-gray-700">
//           SuperAdmin Registration
//         </h2>

//         {error && <p className="text-red-500 text-center mt-2">{error}</p>}

//         <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
//           {/* Name Field */}
//           <div>
//             <label className="block text-gray-600 font-medium">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Email Field */}
//           <div>
//             <label className="block text-gray-600 font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Password Field */}
//           <div>
//             <label className="block text-gray-600 font-medium">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Phone Field */}
//           <div>
//             <label className="block text-gray-600 font-medium">Phone</label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
//             disabled={loading}
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminRegister;

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SuperAdminRegister = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/superadmin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || "Registration failed");

      alert("SuperAdmin registered successfully!");
      router.replace("/login"); // Use replace() instead of push()
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-gray-800 shadow-2xl rounded-xl p-8">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            SuperAdmin Registration
          </h2>
          <p className="text-gray-300">
            Join TruckNet as a SuperAdmin to manage and oversee the platform.
            Register to access advanced administrative features.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-center mt-4 font-medium">{error}</p>
        )}

        {/* Registration Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="Enter your email address"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="Create a strong password"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-400 font-semibold hover:underline focus:outline-none"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminRegister;