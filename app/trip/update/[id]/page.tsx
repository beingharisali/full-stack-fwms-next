"use client";

import { useEffect, useState } from "react";
import { Trip } from "@/types/trip";
import { useParams, useRouter } from "next/navigation";
import { getTripById, updateTrip, deleteTrip } from "@/services/trip.api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function UpdateTrip() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();

	const [trip, setTrip] = useState<Trip | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;

		getTripById(id)
			.then((data) => setTrip(data))
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) return <div className="flex justify-center items-center h-64"><p>Loading...</p></div>;
	if (!trip) return <div className="flex justify-center items-center h-64"><p>Trip not found</p></div>;

	const handleSave = async () => {
		if (!trip) return;

		try {
			await updateTrip(id!, trip);
			router.push("/trip");
		} catch (error) {
			console.error("Failed to update trip:", error);
		}
	};

	const handleDelete = async () => {
		if (!confirm("Delete this trip?")) return;

		try {
			await deleteTrip(id!);
			router.push("/trip");
		} catch (error) {
			console.error("Failed to delete trip:", error);
		}
	};

	return (
		<ProtectedRoute allowedRoles={["admin", "manager"]}>
			<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold mb-6 text-center">Update Trip</h1>
				
				<div className="space-y-4">
					<input
						placeholder="Departure"
						value={trip.departure}
						onChange={(e) => setTrip({ ...trip, departure: e.target.value })}
						className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<input
						placeholder="Destination"
						value={trip.destination}
						onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
						className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<input
						type="date"
						value={trip.date}
						onChange={(e) => setTrip({ ...trip, date: e.target.value })}
						className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<input
						type="time"
						placeholder="Departure Time"
						value={trip.departureTime}
						onChange={(e) => setTrip({ ...trip, departureTime: e.target.value })}
						className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<input
						type="time"
						placeholder="Arrival Time"
						value={trip.arrivalTime}
						onChange={(e) => setTrip({ ...trip, arrivalTime: e.target.value })}
						className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<div className="flex gap-3 mt-6">
						<button
							onClick={handleSave}
							className="flex-1 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-200">
							Update
						</button>
						<button
							onClick={handleDelete}
							className="flex-1 bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-200">
							Delete
						</button>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}