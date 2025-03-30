"use client"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 px-6">
      <h1 className="text-9xl font-extrabold text-red-600 animate-pulse">
        404
      </h1>
      <h2 className="text-3xl font-bold mt-4">Oops! Page Not Found</h2>
      <p className="mt-2 text-lg text-gray-600 text-center">
        The page you&#39;re looking for doesn&#39;t exist or has been moved.
      </p>

      <div className="mt-6">
        <a
          href="/"
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Go Back Home
        </a>
      </div>

      <div className="mt-10">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
          alt="Not Found"
          className="w-40 h-40 opacity-80"
        />
      </div>
    </div>
  );
}
