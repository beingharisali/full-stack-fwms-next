"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/");
			return;
		}

		// Decode token to get user info (simple decode, in production use proper JWT verification)
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
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

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-lg shadow p-6 mb-6">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold text-gray-800">
							Welcome, {user.firstName} {user.lastName}
						</h1>
						<button
							onClick={handleLogout}
							className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
						>
							Logout
						</button>
					</div>
					<p className="text-gray-600 mt-2">Role: {user.role}</p>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-4">Dashboard</h2>
					<p className="text-gray-600">
						You have successfully logged in to the Fleet Waste Management System.
					</p>
				</div>
			</div>
		</div>
	);
}