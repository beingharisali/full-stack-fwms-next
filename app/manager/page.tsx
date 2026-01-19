"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../manager/component/navbar";
import LoadingBar from "../component/LoadingBar";
import { getTrips } from "@/services/trip.api";
import { getDrivers } from "@/services/driver.api";
import { Trip } from "@/types/trip";

const ITEMS_PER_PAGE = 5;

export default function ManagerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<"none" | "trips" | "drivers">("trips");

  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loadingTrips, setLoadingTrips] = useState(false);

  const [tripSort, setTripSort] = useState<"none" | "time" | "name">("none");
  const [driverSort, setDriverSort] = useState<"none" | "name">("none");
  const [driverLicenseFilter, setDriverLicenseFilter] = useState("all");

  const [tripPage, setTripPage] = useState(1);
  const [driverPage, setDriverPage] = useState(1);

  // --- Auth & initial data fetch ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/");

    try {
      setUser(JSON.parse(atob(token.split(".")[1])));
    } catch {
      localStorage.removeItem("token");
      return router.push("/");
    }

    const delay = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms));

    const init = async () => {
      setPageLoading(true);
      await Promise.all([fetchTrips(), fetchDrivers(), delay(1000)]);
      setPageLoading(false);
    };
    init();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoadingTrips(true);
      const res = await getTrips();
      setTrips(Array.isArray(res) ? res : []);
    } finally {
      setLoadingTrips(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res: any = await getDrivers();
      const driverList = Array.isArray(res)
        ? res
        : Array.isArray(res?.drivers)
        ? res.drivers
        : [];
      setDrivers(driverList);
    } catch {
      setDrivers([]);
    }
  };

  const handleView = (type: "none" | "trips" | "drivers") => {
    setView(type);
    setTripPage(1);
    setDriverPage(1);
  };

  // --- Trips sorting & pagination ---
  const sortedTrips = useMemo(() => {
    if (tripSort === "time")
      return [...trips].sort((a, b) =>
        (a.departureTime || "").localeCompare(b.departureTime || "")
      );
    if (tripSort === "name")
      return [...trips].sort((a, b) => a.destination.localeCompare(b.destination));
    return trips;
  }, [trips, tripSort]);

  const paginatedTrips = useMemo(() => {
    const start = (tripPage - 1) * ITEMS_PER_PAGE;
    return sortedTrips.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedTrips, tripPage]);

  // --- Drivers filtering, sorting & pagination ---
  const filteredDrivers = useMemo(() => {
    let list = Array.isArray(drivers) ? [...drivers] : [];
    if (driverLicenseFilter !== "all") {
      list = list.filter(d => d.licenseType === driverLicenseFilter);
    }
    if (driverSort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [drivers, driverLicenseFilter, driverSort]);

  const paginatedDrivers = useMemo(() => {
    const start = (driverPage - 1) * ITEMS_PER_PAGE;
    return filteredDrivers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDrivers, driverPage]);

  // --- Page loading ---
  if (pageLoading) {
    return <LoadingBar title="Loading Manager Dashboard" duration={2} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar setView={handleView} currentView={view} />

      <main className="p-8 space-y-10">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-black">Total Trips</h3>
            <p className="text-3xl font-medium">{trips.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-black">Total Drivers</h3>
            <p className="text-3xl font-medium">{drivers.length}</p>
          </div>
        </div>

        {/* TRIPS TABLE */}
        {view === "trips" && (
          <div className="bg-white rounded-xl shadow">
            <div className="bg-slate-900 text-white px-6 py-4 rounded-t-xl flex justify-between">
              <h2 className="text-lg font-semibold">Trips</h2>
              <select
                value={tripSort}
                onChange={e => setTripSort(e.target.value as any)}
                className="bg-white text-black px-3 py-1 rounded"
              >
                <option value="none">Normal Order</option>
                <option value="time">Early Departure</option>
                <option value="name">Destination (A–Z)</option>
              </select>
            </div>

            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Departure</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Destination</th>
                  <th className="px-4 py-3 text-left">Time</th>
                </tr>
              </thead>

              <tbody>
                {paginatedTrips.map(trip => (
                  <tr key={trip._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-3">{trip.departure}</td>
                    <td className="px-4 py-3">
                      {new Date(trip.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{trip.destination}</td>
                    <td className="px-4 py-3">{trip.departureTime || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <button
                disabled={tripPage === 1}
                onClick={() => setTripPage(p => p - 1)}
                className="px-4 py-2 bg-slate-900 text-white rounded disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm">Page {tripPage}</span>
              <button
                disabled={tripPage * ITEMS_PER_PAGE >= trips.length}
                onClick={() => setTripPage(p => p + 1)}
                className="px-4 py-2 bg-slate-900 text-white rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* DRIVERS TABLE */}
        {view === "drivers" && (
          <div className="bg-white rounded-xl shadow">
            <div className="bg-slate-900 text-white px-6 py-4 rounded-t-xl flex justify-between">
              <h2 className="text-lg font-semibold">Drivers</h2>
              <div className="flex gap-3">
                <select
                  value={driverLicenseFilter}
                  onChange={e => {
                    setDriverLicenseFilter(e.target.value);
                    setDriverPage(1);
                  }}
                  className="bg-white text-black px-3 py-1 rounded"
                >
                  <option value="all">All License</option>
                  <option value="LTV">LTV</option>
                  <option value="HTV">HTV</option>
                  <option value="MCV">MCV</option>
                </select>

                <select
                  value={driverSort}
                  onChange={e => {
                    setDriverSort(e.target.value as any);
                    setDriverPage(1);
                  }}
                  className="bg-white text-black px-3 py-1 rounded"
                >
                  <option value="none">Normal</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>
            </div>

            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">License No</th>
                  <th className="px-4 py-3 text-left">License Type</th>
                </tr>
              </thead>

              <tbody>
                {paginatedDrivers.map(driver => (
                  <tr key={driver._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-3">{driver.name}</td>
                    <td className="px-4 py-3">{driver.licenseNumber}</td>
                    <td className="px-4 py-3">{driver.licenseType}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <button
                disabled={driverPage === 1}
                onClick={() => setDriverPage(p => p - 1)}
                className="px-4 py-2 bg-slate-900 text-white rounded disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm">
                Page {driverPage} of {Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE)}
              </span>

              <button
                disabled={driverPage * ITEMS_PER_PAGE >= filteredDrivers.length}
                onClick={() => setDriverPage(p => p + 1)}
                className="px-4 py-2 bg-slate-900 text-white rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
