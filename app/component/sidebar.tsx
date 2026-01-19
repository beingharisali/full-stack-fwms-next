import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-md text-sm font-medium transition
     ${
       pathname === path
         ? "bg-gray-900 text-white shadow"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 shadow-lg p-6">
      {/* TITLE */}
      <h1 className="text-xl font-semibold text-white mb-8 tracking-wide">
        Admin Panel
      </h1>

      {/* NAV */}
      <nav className="flex flex-col space-y-2">
        <Link href="/admin" className={linkClass("/admin")}>
          Dashboard
        </Link>

        <Link href="/users" className={linkClass("/users")}>
          Users
        </Link>

        <Link href="/vehicle" className={linkClass("/vehicle")}>
          Vehicles
        </Link>

        <Link href="/trip" className={linkClass("/trip")}>
          Trips
        </Link>

        <Link href="/driver" className={linkClass("/driver")}>
          driver
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
