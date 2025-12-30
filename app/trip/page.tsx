"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrips, deleteTrip } from "@/services/trip.api";
import { Trip } from "@/types/trip";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";

export default function TripsPage() {
	const router = useRouter();
	const [trips, setTrips] = useState<Trip[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchTrips();
	}, []);

	const fetchTrips = async () => {
		try {
			setLoading(true);
			const data = await getTrips();
			setTrips(data);
		} catch (err) {
			setError("Failed to fetch trips");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this trip?")) return;

		try {
			await deleteTrip(id);
			setTrips((prev) => prev.filter((t) => t._id !== id));
		} catch (err) {
			alert("Failed to delete trip");
			console.error(err);
		}
	};

	if (loading) return <div className="flex min-h-screen bg-gray-100"><Sidebar/><div className="flex-1"><Navbar/><p className="p-10 text-gray-800">Loading...</p></div></div>;
	if (error) return <div className="flex min-h-screen bg-gray-100"><Sidebar/><div className="flex-1"><Navbar/><p className="p-10 text-red-500">{error}</p></div></div>;

	return (
		<div className="flex min-h-screen bg-gray-100">
			<Sidebar/>
			<div className="flex-1 flex flex-col">
				<Navbar/>
				<main className="p-8 flex-1">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-2xl font-bold text-gray-800">Trips</h1>
						<button
							onClick={() => router.push("/trip/create")}
							className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
							Create Trip
						</button>
					</div>

					{trips.length === 0 ? (
						<p className="text-gray-800 font-bold">No trips saved yet ❌</p>
					) : (
						<div className="bg-white rounded-lg shadow overflow-hidden">
							<table className="w-full">
								<thead className="bg-gray-800 text-white">
									<tr>
										<th className="px-4 py-3 text-left">Departure</th>
										<th className="px-4 py-3 text-left">Date</th>
										<th className="px-4 py-3 text-left">Destination</th>
										<th className="px-4 py-3 text-left">Departure Time</th>
										<th className="px-4 py-3 text-left">Arrival Time</th>
										<th className="px-4 py-3 text-left">Actions</th>
									</tr>
								</thead>
								<tbody>
									{trips.map((trip) => (
										<tr key={trip._id} className="border-b border-gray-200">
											<td className="px-4 py-3 text-gray-800">{trip.departure}</td>
											<td className="px-4 py-3 text-gray-800">{new Date(trip.date).toLocaleDateString()}</td>
											<td className="px-4 py-3 text-gray-800">{trip.destination}</td>
											<td className="px-4 py-3 text-gray-800">{trip.departureTime || "-"}</td>
											<td className="px-4 py-3 text-gray-800">{trip.arrivalTime || "-"}</td>
											<td className="px-4 py-3">
												<div className="flex gap-2">
													<button
														onClick={() => router.push(`/trip/update/${trip._id}`)}
														className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
														Edit
													</button>
													<button
														onClick={() => handleDelete(trip._id!)}
														className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
														Delete
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
console.log("object")