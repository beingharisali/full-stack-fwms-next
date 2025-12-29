import React from "react";
import Link from "next/link";

function Sidebar() {
	return (
		<aside className="w-64 bg-gray-800 shadow-md p-6 border-r border-gray-600">
			<h1 className="text-2xl font-bold mb-6 text-white">Admin Panel</h1>
			<nav className="flex flex-col space-y-2">
				<a
					href="#dashboard"
					className="px-4 py-2 rounded text-white hover:bg-gray-700 transition-colors">
					Dashboard
				</a>
				<a
					href="#users"
					className="px-4 py-2 rounded text-white hover:bg-gray-700 transition-colors">
					Users
				</a>
				<a
					href="#vehicles"
					className="px-4 py-2 rounded text-white hover:bg-gray-700 transition-colors">
					Vehicles
				</a>
				<Link
					href="/trip"
					className="px-4 py-2 rounded text-white hover:bg-gray-700 transition-colors">
					Trips
				</Link>
				<a
					href="#tasks"
					className="px-4 py-2 rounded text-white hover:bg-gray-700 transition-colors">
					Tasks
				</a>
			</nav>
		</aside>
	);
}

export default Sidebar;
