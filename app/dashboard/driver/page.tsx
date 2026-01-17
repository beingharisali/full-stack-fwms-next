"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import DriverNavbar from "../driver/component/navbar";
import { getTrips } from "../../../services/trip.api";

interface Trip {
	_id: string;
	id: number;
	status: "Pending" | "Ongoing" | "Completed";
	departure: string;
	destination: string;
	createdAt: string;
}

export default function DriverPage() {
	const router = useRouter();
	const [trips, setTrips] = useState<Trip[]>([]);
	const [loadingTrips, setLoadingTrips] = useState(false);
	const [view, setView] = useState<"none" | "trips">("none");

	// 🔹 Search / Sort / Pagination
	const [search, setSearch] = useState("");
	const [sortType, setSortType] = useState<
		"date-desc" | "date-asc" | "az" | "za"
	>("date-desc");
	const [currentPage, setCurrentPage] = useState(1);

	const ITEMS_PER_PAGE = 5;

	useEffect(() => {
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role");
		if (!token || role !== "driver") {
			router.push("/");
		}
	}, [router]);

	const fetchTrips = async () => {
		try {
			setLoadingTrips(true);
			const data = await getTrips();
			setTrips(data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoadingTrips(false);
		}
	};

	const handleView = async (type: "trips") => {
		if (type === "trips" && trips.length === 0) await fetchTrips();
		setView(type);
	};

	// 🔹 SEARCH + SORT (A–Z / DATE)
	const filteredTrips = useMemo(() => {
		let data = [...trips];

		// Search
		if (search) {
			data = data.filter(
				(t) =>
					t.departure.toLowerCase().includes(search.toLowerCase()) ||
					t.destination.toLowerCase().includes(search.toLowerCase())
			);
		}

		// Sorting
		switch (sortType) {
			case "az":
				data.sort((a, b) =>
					a.departure.localeCompare(b.departure)
				);
				break;
			case "za":
				data.sort((a, b) =>
					b.departure.localeCompare(a.departure)
				);
				break;
			case "date-asc":
				data.sort(
					(a, b) =>
						new Date(a.createdAt).getTime() -
						new Date(b.createdAt).getTime()
				);
				break;
			default:
				data.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime()
				);
		}

		return data;
	}, [trips, search, sortType]);

	// 🔹 Pagination
	const totalPages = Math.ceil(filteredTrips.length / ITEMS_PER_PAGE);
	const paginatedTrips = filteredTrips.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	return (
		<div className="flex flex-col min-h-screen bg-white text-black">
			<DriverNavbar setView={handleView} currentView={view} />

			<main className="p-8 flex-1">
				{view === "trips" && (
					<div className="bg-white border rounded overflow-x-auto">
						<h2 className="text-xl font-bold p-6 border-b">
							Assigned Trips
						</h2>

						{/* 🔹 Search + Sort */}
						<div className="flex flex-wrap gap-4 p-4">
							<input
								type="text"
								placeholder="Search pickup or drop"
								className="border px-3 py-2 rounded w-full md:w-320"
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setCurrentPage(1);
								}}
							/>

							<select
								className="border px-3 py-2 rounded"
								value={sortType}
								onChange={(e) => setSortType(e.target.value as any)}>
								<option value="date-desc">Newest First</option>
								<option value="date-asc">Oldest First</option>
								<option value="az">Pickup A–Z</option>
								<option value="za">Pickup Z–A</option>
							</select>
						</div>

						<table className="w-full text-left">
							<thead className="border-b">
								<tr>
									<th className="p-3">Pickup</th>
									<th className="p-3">Drop</th>
									<th className="p-3">Date</th>
									<th className="p-3">Time</th>
								</tr>
							</thead>
							<tbody>
								{loadingTrips ? (
									<tr>
										<td colSpan={4} className="p-6 text-center">
											Loading trips...
										</td>
									</tr>
								) : paginatedTrips.length === 0 ? (
									<tr>
										<td colSpan={4} className="p-6 text-center">
											No trips found
										</td>
									</tr>
								) : (
									paginatedTrips.map((trip) => {
										const dateObj = new Date(trip.createdAt);
										return (
											<tr
												key={trip._id}
												className="border-t hover:bg-gray-100">
												<td className="p-3">{trip.departure}</td>
												<td className="p-3">{trip.destination}</td>
												<td className="p-3">
													{dateObj.toLocaleDateString()}
												</td>
												<td className="p-3">
													{dateObj.toLocaleTimeString()}
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>

						{/* 🔹 Pagination */}
						<div className="flex justify-center gap-2 p-4">
							{Array.from({ length: totalPages }).map((_, i) => (
								<button
									key={i}
									onClick={() => setCurrentPage(i + 1)}
									className={`px-3 py-1 border rounded ${
										currentPage === i + 1
											? "bg-black text-white"
											: "bg-white"
									}`}>
									{i + 1}
								</button>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
