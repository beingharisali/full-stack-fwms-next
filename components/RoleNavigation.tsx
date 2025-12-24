"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function RoleNavigation() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getNavItems = () => {
    const baseItems = [
      { href: "/dashboard", label: "Dashboard" }
    ];

    switch (user.role) {
      case "admin":
        return [
          ...baseItems,
          { href: "/admin", label: "Admin Panel" },
          { href: "/manager", label: "Manager Panel" },
          { href: "/driver", label: "Driver Panel" },
          { href: "/trip", label: "Trips" }
        ];
      case "manager":
        return [
          ...baseItems,
          { href: "/manager", label: "Manager Panel" },
          { href: "/trip", label: "Trips" }
        ];
      case "driver":
        return [
          ...baseItems,
          { href: "/driver", label: "Driver Panel" },
          { href: "/trip", label: "My Trips" }
        ];
      default:
        return baseItems;
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {getNavItems().map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:bg-blue-700 px-3 py-2 rounded"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <span>{user.firstName} ({user.role})</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}