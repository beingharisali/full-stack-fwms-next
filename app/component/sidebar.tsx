import React from "react";
import Link from "next/link";

function Sidebar() {
	console.log()
	return (
		<aside className="w-64  bg-gray-800 shadow-md p-6 border-r border-gray-600">
			{/* <h1 className="text-2xl font-bold mb-6 text-white">Admin Panel</h1> */}
			<nav className="flex flex-col space-y-2">
				<Link
					href="#dashboard"
					className="px-4 py-2 rounded text-white hover:bg-gray-700 transition-colors">
					Dashboard
				</Link>
				<Link
					href="#users"
					className="px-4 py-2 rounded text-white hover:bg-gray-700 transition-colors">
					Users
				</Link>
				
				<Link
					href="/vehicle"
					className="px-4 py-2 rounded text-white hover:bg-gray-700 transition-colors">
					Vehicles
				</Link>
				<Link
					href="/trip"
					className="px-4 py-2 rounded text-white hover:bg-gray-700 transition-colors">
					Trips
				</Link>
				<Link
			
					href="/driver"
					className="px-4 py-2 rounded text-white hover:bg-gray-700 transition-colors">
					driver
				</Link>
			</nav>
		</aside>
	);
}

export default Sidebar;