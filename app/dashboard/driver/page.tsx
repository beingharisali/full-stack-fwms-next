"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import DriverNavbar from "../driver/component/navbar";
import { getDriverTrips } from "@/services/trip.api"; 
import { getMyDriverProfile } from "@/services/driver.api";
import LoadingBar from "../../component/LoadingBar";
import { Trip } from "@/types/trip";
import { Driver } from "@/types/driver";

const ITEMS_PER_PAGE = 5;

export default function DriverPage() {
    const router = useRouter();
    const [driver, setDriver] = useState<Driver | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [loadingTrips, setLoadingTrips] = useState(false);
    const [view, setView] = useState<"none" | "trips">("trips");
    const [tripPage, setTripPage] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token || role !== "driver") return router.push("/");

        const init = async () => {
            setPageLoading(true);
            // Dono APIs ko saath call kar rahe hain efficiency ke liye
            await Promise.all([fetchTrips(), fetchDriverProfile()]);
            setTimeout(() => setPageLoading(false), 800);
        };
        init();
    }, [router]);

    const fetchDriverProfile = async () => {
        try {
            const driverData = await getMyDriverProfile();
            setDriver(driverData);
        } catch (err) {
            console.error("Error fetching driver profile:", err);
        }
    };

    const fetchTrips = async () => {
        try {
            setLoadingTrips(true);
            const data = await getDriverTrips(); 
            setTrips(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setTrips([]);
        } finally {
            setLoadingTrips(false);
        }
    };

    const handleView = async (type: "trips") => {
        if (type === "trips" && trips.length === 0) await fetchTrips();
        setView(type);
    };

    const paginatedTrips = useMemo(() => {
        const start = (tripPage - 1) * ITEMS_PER_PAGE;
        return trips.slice(start, start + ITEMS_PER_PAGE);
    }, [trips, tripPage]);

    const formatDate = (dateString: any) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    if (pageLoading) {
        return <LoadingBar title="Loading Driver Dashboard" duration={2} />;
    }

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <DriverNavbar setView={handleView} currentView={view} />

            <main className="p-8 space-y-10">
                {/* 1. Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-slate-800">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Trips</h3>
                        <p className="text-3xl font-black">{trips.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-600">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Ongoing</h3>
                        <p className="text-3xl font-black text-blue-600">
                            {trips.filter(t => t.status === "Ongoing").length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-600">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Completed</h3>
                        <p className="text-3xl font-black text-green-600">
                            {trips.filter(t => t.status === "Completed").length}
                        </p>
                    </div>
                </div>

                {/* 2. Assigned Vehicle Section (Added from old code) */}
                {driver && (
                    <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
                        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-semibold tracking-tight">Assigned Vehicle 🚗</h2>
                        </div>
                        <div className="p-6">
                            {driver.assignedVehicle ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Vehicle Number</p>
                                        <p className="text-xl font-black text-slate-800">
                                            {driver.assignedVehicle.number}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Vehicle Type</p>
                                        <p className="text-xl font-black text-slate-800">
                                            {driver.assignedVehicle.type}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Current Status</p>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${
                                                driver.assignedVehicle.status === "In-Use"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : driver.assignedVehicle.status === "Available"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-orange-100 text-orange-700"
                                            }`}>
                                            {driver.assignedVehicle.status}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4 font-medium italic">
                                    No vehicle assigned by management yet.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. Trips Table Section */}
                {view === "trips" && (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-t border-slate-700">
                            <h2 className="text-lg font-semibold tracking-tight">Assigned Trip Schedule</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100 border-b text-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase">Destination</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase">Departure</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase">Arrival</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase text-center">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {loadingTrips ? (
                                        <tr><td colSpan={5} className="p-10 text-center text-gray-400">Loading trips...</td></tr>
                                    ) : paginatedTrips.length === 0 ? (
                                        <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-medium">No trips assigned to you yet.</td></tr>
                                    ) : (
                                        paginatedTrips.map((trip) => (
                                            <tr key={trip._id} className="hover:bg-blue-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800">
                                                        {trip.departure} <span className="text-blue-500 mx-2">→</span> {trip.destination}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">
                                                    {formatDate(trip.date)}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-blue-700">
                                                    {trip.departureTime || "--:--"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {trip.arrivalTime || "--:--"}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        trip.status === "Ongoing" ? "bg-blue-100 text-blue-700"
                                                        : trip.status === "Completed" ? "bg-green-100 text-green-700"
                                                        : "bg-amber-100 text-amber-700"
                                                    }`}>
                                                        {trip.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
                            <button
                                disabled={tripPage === 1}
                                onClick={() => setTripPage((p) => p - 1)}
                                className="px-4 py-2 text-sm font-bold bg-white border border-slate-300 rounded shadow-sm disabled:opacity-30 hover:bg-gray-50">
                                Previous
                            </button>
                            <span className="text-xs font-bold text-gray-500 uppercase">
                                Page {tripPage} of {Math.ceil(trips.length / ITEMS_PER_PAGE) || 1}
                            </span>
                            <button
                                disabled={tripPage * ITEMS_PER_PAGE >= trips.length}
                                onClick={() => setTripPage((p) => p + 1)}
                                className="px-4 py-2 text-sm font-bold bg-white border border-slate-300 rounded shadow-sm disabled:opacity-30 hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}