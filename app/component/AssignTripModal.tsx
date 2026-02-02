"use client";

import { useEffect, useState } from "react";
import { Driver } from "@/types/driver";
import { getDrivers } from "@/services/driver.api";
import { assignTrip, unassignTrip } from "@/services/trip.api";

interface AssignedDriver {
	_id: string;
	name: string;
	licenseType: string;
}

interface AssignTripModalProps {
	isOpen: boolean;
	tripId: string;
	assignedDriver?: AssignedDriver | null;
	onClose: () => void;
	onAssign: () => void;
}

export default function AssignTripModal({
	isOpen,
	tripId,
	assignedDriver,
	onClose,
	onAssign,
}: AssignTripModalProps) {
	const [drivers, setDrivers] = useState<Driver[]>([]);
	const [selectedDriverId, setSelectedDriverId] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isOpen) {
			fetchDrivers();
			if (assignedDriver) {
				setSelectedDriverId(assignedDriver._id || "");
			}
		}
	}, [isOpen, assignedDriver]);

	const fetchDrivers = async () => {
		try {
			// getDrivers returns { drivers: Driver[], totalPages: number }
			const res = await getDrivers(1, 100);
			const list = res?.drivers || [];
			setDrivers(
				list.filter(
					(d: Driver) => d.available || d._id === assignedDriver?._id,
				),
			);
		} catch {
			setError("Failed to fetch drivers");
		}
	};

	const handleAssign = async () => {
		if (!selectedDriverId) {
			setError("Please select a driver");
			return;
		}

		setLoading(true);
		try {
			await assignTrip(tripId, selectedDriverId);
			setError(null);
			onAssign();
			onClose();
		} catch {
			setError("Failed to assign trip");
		} finally {
			setLoading(false);
		}
	};

	const handleUnassign = async () => {
		setLoading(true);
		try {
			await unassignTrip(tripId);
			setError(null);
			setSelectedDriverId("");
			onAssign();
			onClose();
		} catch {
			setError("Failed to unassign trip");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl p-6 w-96 max-h-[calc(100vh-120px)] overflow-y-auto">
				<div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-900">
						{assignedDriver ? "Update Assignment" : "Assign Trip to Driver"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded transition-colors">
						×
					</button>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm flex items-start gap-2">
						<span className="text-red-500 font-bold mt-0.5">!</span>
						<span>{error}</span>
					</div>
				)}

				{assignedDriver && (
					<div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-md">
						<p className="text-sm text-gray-700">
							<strong className="text-gray-900">Currently Assigned:</strong>
							<br />
							<span className="text-blue-600 font-semibold">
								{assignedDriver.name}
							</span>
						</p>
					</div>
				)}

				<div className="mb-6">
					<label className="block text-sm font-semibold text-gray-900 mb-3">
						Select Driver
					</label>
					<select
						value={selectedDriverId}
						onChange={(e) => setSelectedDriverId(e.target.value)}
						className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
						<option value="">-- Choose a driver --</option>
						{drivers.map((driver) => (
							<option key={driver._id} value={driver._id}>
								{driver.name} ({driver.licenseType})
							</option>
						))}
					</select>
				</div>

				<div className="flex gap-3 pt-6 border-t border-gray-200">
					{assignedDriver && (
						<button
							onClick={handleUnassign}
							disabled={loading}
							className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
							{loading ? "Unassigning..." : "Unassign"}
						</button>
					)}
					<button
						onClick={handleAssign}
						disabled={loading}
						className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
						{loading ? "Assigning..." : assignedDriver ? "Update" : "Assign"}
					</button>
					<button
						onClick={onClose}
						disabled={loading}
						className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2.5 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
