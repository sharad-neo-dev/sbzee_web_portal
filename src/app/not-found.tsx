import React from "react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-white px-4">
      <div className="text-center">
        {/* Big 404 */}
        <h1 className="text-[8rem] font-extrabold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600 animate-pulse">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
