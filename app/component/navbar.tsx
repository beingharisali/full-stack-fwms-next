"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
	console.log('');
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
		} catch (error) {
			localStorage.removeItem("token");
			router.push("/");
		}
	}, [router]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		router.push("/");
	};

	if (!user) return <div>Loading...</div>;

	return (
		<header className="bg-white shadow flex justify-between items-center py-4 border-b border-gray-300 w-full">
			<div className="flex items-center space-x-6">
				<h2 className="text-xl font-semibold text-gray-800">Fleet Watch Managment System</h2>
				{/* <Link
					href="/trip"
					className="text-gray-800 hover:text-gray-600 transition-colors">
					Trips
				</Link> */}
			</div>
			<div className="flex items-center space-x-4">
				<span className="text-gray-800">
					{user.firstName} {user.lastName} | Role: {user.role}
				</span>
				<button
					onClick={handleLogout}
					className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
					Logout
				</button>
			</div>
		</header>
	);
}