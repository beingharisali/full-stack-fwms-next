"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  firstName: string;
  lastName: string;
  role: string;
}

interface DriverNavbarProps {
  setView: (view: "trips") => void; // Only trips button
  currentView: "none" | "trips";
}

export default function DriverNavbar({ setView, currentView }: DriverNavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

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

  if (!user) return <div className="p-10 text-gray-700">Loading...</div>;

  return (
    <header className="bg-white shadow flex justify-between items-center py-6 px-8 border-b border-gray-300 w-full">
      {/* Left: System Name + Trips Button */}
      <div className="flex items-center space-x-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Fleet Watch Management System
        </h2>

        <button
          onClick={() => setView("trips")}
          className={`px-4 py-2 rounded text-white font-medium transition-colors ${
            currentView === "trips" ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-500/80"
          }`}
        >
          Trips
        </button>
      </div>

      {/* Right: User info + Logout */}
      <div className="flex items-center space-x-6">
        <span className="text-gray-800 font-medium">
          {user.firstName} {user.lastName} | Role: {user.role}
        </span>
        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
