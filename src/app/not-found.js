// app/not-found.js
"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-2xl font-semibold text-gray-800">
        Page Not Found
      </p>
      <p className="mt-2 text-gray-600">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
