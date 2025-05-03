"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.name || "User");
      } catch {
        setUserName("User");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
    console.log("Logout triggered");
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div
            onClick={() => (window.location.href = "/")}
            className="text-2xl font-extrabold text-indigo-600 cursor-pointer hover:opacity-80 transition"
          >
            TaskManager
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/my-tasks"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              My Tasks
            </Link>
            <Link
              href="/notifications"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Notifications
            </Link>

            <input
              type="text"
              placeholder="Search tasks..."
              className="border border-gray-300 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <span className="ml-2 px-2 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded capitalize">
              {userName || "Guest"}
            </span>

            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md shadow hover:from-red-600 hover:to-red-700 text-sm transition"
            >
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-800 text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-md px-4 py-4 space-y-3 animate-slide-down">
            <Link
              href="/dashboard"
              className="block text-gray-700 hover:text-indigo-600"
            >
              Dashboard
            </Link>
            <Link
              href="/tasks/create"
              className="block text-gray-700 hover:text-indigo-600"
            >
              Create Task
            </Link>
            <Link
              href="/tasks/my"
              className="block text-gray-700 hover:text-indigo-600"
            >
              My Tasks
            </Link>
            <Link
              href="/notifications"
              className="block text-gray-700 hover:text-indigo-600"
            >
              Notifications
            </Link>
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-green-600 capitalize">
                👋 {userName || "Guest"}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
