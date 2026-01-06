"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      localStorage.removeItem("token");
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <header className="bg-white shadow-md border-b border-gray-300 w-full px-8 py-4 mb-6">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Fleet Watch Management System
          </h2>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 text-sm md:text-base">
            {user.firstName} {user.lastName} | Role: {user.role}
          </span>

          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
