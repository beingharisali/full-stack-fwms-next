"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "./component/navbar";
import LoadingBar from "../component/LoadingBar";
import { getTrips } from "@/services/trip.api";
import { getDrivers } from "@/services/driver.api";
import { getVehicles } from "@/services/vehicle.api";

const ITEMS_PER_PAGE = 8;
type ViewType = "none" | "trips" | "drivers" | "vehicles";

export default function ManagerPage() {
	const [view, setView] = useState<ViewType>("trips");
	const [trips, setTrips] = useState<any[]>([]);
	const [drivers, setDrivers] = useState<any[]>([]);
	const [vehicles, setVehicles] = useState<any[]>([]);
	const [pageLoading, setPageLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const init = async () => {
			setPageLoading(true);
			await Promise.all([fetchTrips(), fetchDrivers(), fetchVehicles()]);
			setPageLoading(false);
		};
		init();
	}, []);

	const fetchTrips = async () => {
		try {
			const res = await getTrips();
			setTrips(Array.isArray(res) ? res : []);
		} catch {
			setTrips([]);
		}
	};
	const fetchDrivers = async () => {
		try {
			const res: any = await getDrivers();
			setDrivers(Array.isArray(res) ? res : res?.drivers || []);
			console.log(res);
		} catch {
			setDrivers([]);
		}
	};
	const fetchVehicles = async () => {
		try {
			const res = await getVehicles();
			setVehicles(Array.isArray(res) ? res : []);
		} catch {
			setVehicles([]);
		}
	};

	const filteredData = useMemo(() => {
		const data =
			view === "trips" ? trips : view === "drivers" ? drivers : vehicles;
		return data.filter((item) =>
			Object.values(item).some((val) =>
				String(val).toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
	}, [view, trips, drivers, vehicles, searchTerm]);

	const tableConfig = useMemo(() => {
		if (view === "drivers") {
			return {
				headers: [
					"Driver Name",
					"Assaigned Vehicle",
					"License Number",
					"Joined Date",
				],
				getRowValues: (item: any) => [
					item.driverName ||
						item.name ||
						`${item.firstName || ""} ${item.lastName || ""}`.trim() ||
						"---",
					item?.assignedVehicle?.number || "unassaigned",

					item.licenseNumber || item.licenseNo || "---",

					item.createdAt
						? new Date(item.createdAt).toLocaleDateString()
						: "---",
				],
			};
		}

		if (view === "vehicles") {
			return {
				headers: ["Vehicle Number", "Type", "Added Date"],
				getRowValues: (item: any) => [
					item.number || item.vehicleNumber || item.registrationNumber || "---",
					item.type || item.vehicleType || "---",

					item.createdAt
						? new Date(item.createdAt).toLocaleDateString()
						: "---",
				],
			};
		}

		return {
			headers: [
				"Departure",
				"Destination",
				"Departure Time",
				"Arrival Time",
				"Date",
			],
			getRowValues: (item: any) => [
				item.departure || "---",
				item.destination || "---",
				item.departureTime || "--:--",
				item.arrivalTime || "--:--",
				item.date ? new Date(item.date).toLocaleDateString() : "---",
			],
		};
	}, [view]);

	const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
	const paginatedData = filteredData.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	if (pageLoading)
		return <LoadingBar title="Fleet Dashboard Loading..." duration={2} />;

	return (
		<div className="min-h-screen bg-white text-black font-sans">
			<Navbar
				setView={(v) => {
					setView(v as any);
					setCurrentPage(1);
				}}
				currentView={view}
			/>

			<main className="max-w-7xl mx-auto p-6">
				{/* Stats Section - Clean Thin Black Borders */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					<div className="p-4 border border-black border-l-4 bg-gray-50 shadow-sm">
						<p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
							Total Trips
						</p>
						<p className="text-xl font-semibold">{trips.length}</p>
					</div>
					<div className="p-4 border border-black border-l-4 bg-gray-50 shadow-sm">
						<p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
							Total Drivers
						</p>
						<p className="text-xl font-semibold">{drivers.length}</p>
					</div>
					<div className="p-4 border border-black border-l-4 bg-gray-50 shadow-sm">
						<p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
							Total Vehicles
						</p>
						<p className="text-xl font-semibold">{vehicles.length}</p>
					</div>
				</div>

				{/* Search Bar - Sharp Thin Border */}
				<div className="flex flex-col md:flex-row gap-3 mb-6">
					<input
						type="text"
						placeholder="Search by any detail..."
						className="flex-grow p-2 border border-black rounded focus:outline-none"
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setCurrentPage(1);
						}}
					/>
					<button className="bg-black text-white px-6 py-2 rounded text-xs font-bold hover:bg-gray-800 transition-all">
						SORT A &rarr; Z
					</button>
				</div>

				{/* Main Table - Thin Black Grid (Image Inspired) */}
				<div className="border border-black rounded overflow-hidden">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-[#e5e7eb] border-b border-black text-[12px]">
								{tableConfig.headers.map((header, index) => (
									<th
										key={header}
										className={`px-4 py-3 font-bold uppercase tracking-tight ${
											index < tableConfig.headers.length - 1
												? "border-r border-black"
												: ""
										}`}>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="text-[13px] divide-y divide-black/10">
							{paginatedData.map((item: any, rowIndex: number) => (
								<tr
									key={
										item._id ||
										item.id ||
										`${view}-${item.number || item.driverName || item.departure || rowIndex}`
									}
									className="hover:bg-gray-50 border-b border-black/10">
									{tableConfig
										.getRowValues(item)
										.map((value: any, index: number) => (
											<td
												key={index}
												className={`px-4 py-3 ${
													index < tableConfig.headers.length - 1
														? "border-r border-black"
														: ""
												} ${index >= 2 ? "text-gray-600" : ""}`}>
												{value}
											</td>
										))}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination Section - Simple Black Style */}
				<div className="mt-8 flex items-center justify-between">
					<p className="text-[12px] font-medium text-gray-500">
						Total {filteredData.length} entries found
					</p>
					<div className="flex items-center gap-1">
						<button
							disabled={currentPage === 1}
							onClick={() => handlePageChange(currentPage - 1)}
							className="px-3 py-1.5 border border-black rounded text-[12px] hover:bg-gray-100 disabled:opacity-30">
							Prev
						</button>

						<div className="flex gap-1 mx-1">
							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(pageNum) => (
									<button
										key={pageNum}
										onClick={() => handlePageChange(pageNum)}
										className={`w-8 h-8 rounded text-[12px] font-bold border transition-all ${
											currentPage === pageNum
												? "bg-black text-white border-black"
												: "bg-white text-black border-black hover:bg-gray-100"
										}`}>
										{pageNum}
									</button>
								),
							)}
						</div>

						<button
							disabled={currentPage === totalPages || totalPages === 0}
							onClick={() => handlePageChange(currentPage + 1)}
							className="px-3 py-1.5 border border-black rounded text-[12px] hover:bg-gray-100 disabled:opacity-30">
							Next
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}
