"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import LoadingBar from "../component/LoadingBar";
import {
	getDrivers,
	deleteDriver,
	assignVehicleToDriver,
	unassignVehicleFromDriver,
} from "../../services/driver.api";
import { getVehicles } from "../../services/vehicle.api";
import { Driver } from "@/types/driver";
import { Vehicle } from "@/types/vehicle";

const ITEMS_PER_PAGE = 5;

export default function DriversPage() {
	const router = useRouter();

	const [drivers, setDrivers] = useState<Driver[]>([]);
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [search, setSearch] = useState("");
	const [licenseType, setLicenseType] = useState("all");

	const [currentPage, setCurrentPage] = useState(1);

	// Vehicle assignment modal state
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
	const [selectedVehicle, setSelectedVehicle] = useState<string>("");
	const [assigning, setAssigning] = useState(false);

	useEffect(() => {
		fetchDriversAndVehicles();
	}, []);

	const fetchDriversAndVehicles = async () => {
		try {
			const [driversRes, vehiclesData] = await Promise.all([
				getDrivers(),
				getVehicles(),
			]);
			setDrivers(driversRes.drivers || []);
			setVehicles(vehiclesData || []);
		} catch {
			setError("Failed to fetch data");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this driver?")) return;
		await deleteDriver(id);
		setDrivers((prev) => prev.filter((d) => d._id !== id));
	};

	const openAssignModal = (driver: Driver) => {
		setSelectedDriver(driver);
		setSelectedVehicle("");
		setShowAssignModal(true);
	};

	const closeAssignModal = () => {
		setShowAssignModal(false);
		setSelectedDriver(null);
		setSelectedVehicle("");
	};

	const handleAssignVehicle = async () => {
		if (!selectedDriver || !selectedVehicle) {
			alert("Please select a vehicle");
			return;
		}

		try {
			setAssigning(true);
			await assignVehicleToDriver(selectedDriver._id, selectedVehicle);
			await fetchDriversAndVehicles();
			closeAssignModal();
			alert("Vehicle assigned successfully");
		} catch (err: any) {
			alert(err.response?.data?.msg || "Failed to assign vehicle");
		} finally {
			setAssigning(false);
		}
	};

	const handleUnassignVehicle = async (driverId: string) => {
		if (!confirm("Are you sure you want to unassign this vehicle?")) return;

		try {
			setAssigning(true);
			await unassignVehicleFromDriver(driverId);
			await fetchDriversAndVehicles();
			alert("Vehicle unassigned successfully");
		} catch (err: any) {
			alert(err.response?.data?.msg || "Failed to unassign vehicle");
		} finally {
			setAssigning(false);
		}
	};

	const filteredDrivers = drivers.filter((d) => {
		const matchesSearch =
			d.name.toLowerCase().includes(search.toLowerCase()) ||
			d.licenseNumber.toLowerCase().includes(search.toLowerCase());

		const matchesLicense =
			licenseType === "all" ? true : d.licenseType === licenseType;

		return matchesSearch && matchesLicense;
	});

	const totalPages = Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE);

	const paginatedDrivers = filteredDrivers.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	const licenseTypes = Array.from(new Set(drivers.map((d) => d.licenseType)));

	if (loading) return <LoadingBar title="Loading Drivers" duration={2} />;

	return (
		<div className="flex min-h-screen bg-white text-black flex-col">
			<Navbar />

			<div className="flex flex-1">
				<Sidebar />

				<div className="flex-1 p-8">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
						<h1 className="text-3xl font-bold">Drivers</h1>
						<button
							onClick={() => router.push("/driver/create")}
							className="bg-black text-white px-4 py-2 rounded">
							Create Driver
						</button>
					</div>

					{error && (
						<div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
							{error}
						</div>
					)}

					<div className="flex flex-col sm:flex-row gap-4 mb-4">
						<input
							placeholder="Search by name or license number..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setCurrentPage(1);
							}}
							className="flex-1 border px-3 py-2 rounded"
						/>
						<select
							value={licenseType}
							onChange={(e) => {
								setLicenseType(e.target.value);
								setCurrentPage(1);
							}}
							className="border px-3 py-2 rounded">
							<option value="all">All License Types</option>
							{licenseTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</div>

					<div className="bg-white shadow overflow-x-auto">
						<table className="w-full border border-black">
							<thead className="bg-gray-200 border border-black">
								<tr>
									<th className="px-4 py-3 border text-left">Name</th>
									<th className="px-4 py-3 border text-left">License Number</th>
									<th className="px-4 py-3 border text-left">License Type</th>
									<th className="px-4 py-3 border text-left">
										Assigned Vehicle
									</th>
									<th className="px-4 py-3 border text-left">Actions</th>
								</tr>
							</thead>

							<tbody>
								{paginatedDrivers.map((d) => (
									<tr key={d._id} className="border border-black">
										<td className="px-4 py-3">{d.name}</td>
										<td className="px-4 py-3">{d.licenseNumber}</td>
										<td className="px-4 py-3">{d.licenseType}</td>
										<td className="px-4 py-3">
											{d.assignedVehicle ? (
												<span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
													{d.assignedVehicle.number}
												</span>
											) : (
												<span className="text-gray-400">Not assigned</span>
											)}
										</td>
										<td className="px-4 py-3 space-x-2 flex flex-wrap gap-1">
											<button
												onClick={() => router.push(`/driver/update/${d._id}`)}
												className="bg-black text-white px-3 py-1 rounded text-sm">
												Edit
											</button>
											{d.assignedVehicle ? (
												<button
													onClick={() => handleUnassignVehicle(d._id)}
													className="bg-orange-600 text-white px-3 py-1 rounded text-sm">
													Unassign
												</button>
											) : (
												<button
													onClick={() => openAssignModal(d)}
													className="bg-green-600 text-white px-3 py-1 rounded text-sm">
													Assign
												</button>
											)}
											<button
												onClick={() => handleDelete(d._id)}
												className="bg-gray-600 text-white px-3 py-1 rounded text-sm">
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{filteredDrivers.length === 0 && (
							<div className="text-center py-6 text-gray-500">
								No drivers found.
							</div>
						)}
					</div>

					{totalPages > 1 && (
						<div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4">
							<button
								onClick={() => setCurrentPage((p) => p - 1)}
								disabled={currentPage === 1}
								className="px-4 py-1 border rounded disabled:opacity-50">
								Prev
							</button>

							<div className="flex gap-2 flex-wrap justify-center">
								{Array.from({ length: totalPages }, (_, i) => i + 1).map(
									(p) => (
										<button
											key={p}
											onClick={() => setCurrentPage(p)}
											className={`px-3 py-1 border rounded ${
												p === currentPage ? "bg-black text-white" : ""
											}`}>
											{p}
										</button>
									),
								)}
							</div>

							<button
								onClick={() => setCurrentPage((p) => p + 1)}
								disabled={currentPage === totalPages}
								className="px-4 py-1 border rounded disabled:opacity-50">
								Next
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Vehicle Assignment Modal */}
			{showAssignModal && selectedDriver && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
						<h2 className="text-2xl font-bold mb-4 text-black">
							Assign Vehicle to {selectedDriver.name}
						</h2>

						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Available Vehicles
							</label>
							<select
								value={selectedVehicle}
								onChange={(e) => setSelectedVehicle(e.target.value)}
								disabled={assigning}
								className="w-full border border-gray-300 rounded px-3 py-2 text-black">
								<option value="">Select a vehicle...</option>
								{vehicles
									.filter((v) => v.status === "Available")
									.map((v) => (
										<option key={v._id} value={v._id}>
											{v.number} ({v.type}) - {v.status}
										</option>
									))}
							</select>
							{vehicles.filter((v) => v.status === "Available").length ===
								0 && (
								<p className="text-sm text-gray-500 mt-2">
									No available vehicles
								</p>
							)}
						</div>

						<div className="flex gap-2 justify-end">
							<button
								onClick={closeAssignModal}
								disabled={assigning}
								className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50">
								Cancel
							</button>
							<button
								onClick={handleAssignVehicle}
								disabled={assigning || !selectedVehicle}
								className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
								{assigning ? "Assigning..." : "Assign"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
