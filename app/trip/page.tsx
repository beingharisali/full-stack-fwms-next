"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import LoadingBar from "../component/LoadingBar";
import AssignTripModal from "../component/AssignTripModal";
import { getTrips, deleteTrip } from "@/services/trip.api";
import { Trip } from "@/types/trip";

const ITEMS_PER_PAGE = 5;

const getPaginationRange = (
	currentPage: number,
	totalPages: number,
	delta = 2,
) => {
	const range: (number | string)[] = [];
	const left = Math.max(2, currentPage - delta);
	const right = Math.min(totalPages - 1, currentPage + delta);

	range.push(1);

	if (left > 2) range.push("...");

	for (let i = left; i <= right; i++) {
		range.push(i);
	}

	if (right < totalPages - 1) range.push("...");

	if (totalPages > 1) range.push(totalPages);

	return range;
};

export default function TripsPage() {
	const router = useRouter();

	const [trips, setTrips] = useState<Trip[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [search, setSearch] = useState("");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const [currentPage, setCurrentPage] = useState(1);

	const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
	const [selectedTripId, setSelectedTripId] = useState<string>("");
	const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

	useEffect(() => {
		fetchTrips();
	}, []);

	const fetchTrips = async () => {
		try {
			const data = await getTrips();
			setTrips(data);
		} catch {
			setError("Failed to fetch trips");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this trip?")) return;
		await deleteTrip(id);
		setTrips((prev) => prev.filter((t) => t._id !== id));
	};

	const handleAssignClick = (trip: Trip) => {
		setSelectedTripId(trip._id || "");
		setSelectedTrip(trip);
		setIsAssignModalOpen(true);
	};

	const handleAssignSuccess = () => {
		fetchTrips();
	};

	let filteredTrips = trips.filter((trip) =>
		`${trip.departure} ${trip.destination}`
			.toLowerCase()
			.includes(search.toLowerCase()),
	);

	filteredTrips.sort((a, b) => {
		const nameA = `${a.departure} ${a.destination}`.toLowerCase();
		const nameB = `${b.departure} ${b.destination}`.toLowerCase();

		return sortOrder === "asc"
			? nameA.localeCompare(nameB)
			: nameB.localeCompare(nameA);
	});

	const totalPages = Math.ceil(filteredTrips.length / ITEMS_PER_PAGE);
	const paginatedTrips = filteredTrips.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	if (loading) return <LoadingBar title="Loading Trips" duration={2} />;

	return (
		<div className="flex min-h-screen bg-white text-black flex-col">
			<Navbar />

			<div className="flex flex-1">
				<Sidebar />

				<div className="flex-1 p-8">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">Trips</h1>
						<button
							onClick={() => router.push("/trip/create")}
							className="bg-black text-white px-4 py-2 rounded">
							Create Trip
						</button>
					</div>

					{error && (
						<div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
							{error}
						</div>
					)}

					<div className="flex gap-4 mb-6 flex-col sm:flex-row">
						<div className="relative flex-1">
							<input
								placeholder="Search by departure or destination..."
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setCurrentPage(1);
								}}
								className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						<button
							onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
							className="border border-gray-300 px-4 py-2.5 rounded-md bg-black text-white hover:bg-gray-800 transition-colors font-medium whitespace-nowrap">
							{sortOrder === "asc" ? "↑ A to Z" : "↓ Z to A"}
						</button>
					</div>

					<div className="bg-white shadow-md rounded-lg overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-100 border-b border-gray-300">
								<tr>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
										Departure
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
										Date
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
										Destination
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
										Departure Time
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
										Arrival Time
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
										Assigned Driver
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
										Status
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
										Actions
									</th>
								</tr>
							</thead>

							<tbody>
								{paginatedTrips.map((trip) => (
									<tr
										key={trip._id}
										className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4 text-sm text-gray-900">
											{trip.departure}
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											{new Date(trip.date).toLocaleDateString()}
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">
											{trip.destination}
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											{trip.departureTime || "—"}
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											{trip.arrivalTime || "—"}
										</td>
										<td className="px-6 py-4">
											{trip.assignedDriver ? (
												<div className="text-sm">
													<p className="font-semibold text-gray-900">
														{trip.assignedDriver.name}
													</p>
													<p className="text-gray-500 text-xs mt-1">
														{trip.assignedDriver.licenseType}
													</p>
												</div>
											) : (
												<span className="text-gray-400 italic text-sm">
													Unassigned
												</span>
											)}
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-block ${
													trip.status === "assigned" ||
													trip.status === "in-progress"
														? "bg-green-100 text-green-700"
														: trip.status === "completed"
															? "bg-blue-100 text-blue-700"
															: "bg-yellow-100 text-yellow-700"
												}`}>
												{trip.status || "unassigned"}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex gap-2 items-center">
												<button
													onClick={() => handleAssignClick(trip)}
													className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
													Assign
												</button>
												<button
													onClick={() =>
														router.push(`/trip/update/${trip._id}`)
													}
													className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
													Edit
												</button>
												<button
													onClick={() => handleDelete(trip._id!)}
													className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
													Delete
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{filteredTrips.length === 0 && (
							<div className="text-center py-12 px-6 bg-gray-50 rounded-b-lg">
								<p className="text-gray-500 text-lg">No trips found.</p>
								<p className="text-gray-400 text-sm mt-2">
									Try adjusting your search criteria
								</p>
							</div>
						)}

						{totalPages > 1 && (
							<div className="flex flex-wrap items-center justify-center gap-2 px-6 py-4 sm:justify-between border-t border-gray-200 bg-gray-50 rounded-b-lg">
								<button
									onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
									disabled={currentPage === 1}
									className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors">
									← Prev
								</button>

								<div className="flex flex-wrap gap-1 justify-center">
									{getPaginationRange(currentPage, totalPages).map((p, i) =>
										p === "..." ? (
											<span key={i} className="px-3 py-2 text-gray-500">
												...
											</span>
										) : (
											<button
												key={p}
												onClick={() => setCurrentPage(p as number)}
												className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
													p === currentPage
														? "bg-black text-white border-black"
														: "border-gray-300 text-gray-700 hover:bg-gray-100"
												}`}>
												{p}
											</button>
										),
									)}
								</div>

								<button
									onClick={() =>
										setCurrentPage((p) => Math.min(p + 1, totalPages))
									}
									disabled={currentPage === totalPages}
									className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors">
									Next →
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			<AssignTripModal
				isOpen={isAssignModalOpen}
				tripId={selectedTripId}
				assignedDriver={selectedTrip?.assignedDriver}
				onClose={() => setIsAssignModalOpen(false)}
				onAssign={handleAssignSuccess}
			/>
		</div>
	);
}
