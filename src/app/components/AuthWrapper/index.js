"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../header";

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const publicRoutes = ["/login", "/register"];

    if (token) {
      setIsAuthenticated(true);
    } else if (!publicRoutes.includes(pathname)) {
      router.push("/login");
    }

    setLoading(false);
  }, [pathname, router]);

  if (loading) return null;

  return (
    <>
      {isAuthenticated && !["/login", "/register"].includes(pathname) && (
        <Header />
      )}
      <div className="min-h-screen lg:w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </>
  );
}
