"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../manager/component/navbar";
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
  const [loadingTrips, setLoadingTrips] = useState(false);

  // SORT & FILTER
  const [tripSort, setTripSort] = useState<"none" | "time" | "name">("none");
  const [driverSort, setDriverSort] = useState<"none" | "name">("none");
  const [driverLicenseFilter, setDriverLicenseFilter] = useState("all");

  // PAGINATION
  const [tripPage, setTripPage] = useState(1);
  const [driverPage, setDriverPage] = useState(1);

  /* ================= AUTH + FETCH ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      setUser(JSON.parse(atob(token.split(".")[1])));
    } catch {
      localStorage.removeItem("token");
      router.push("/");
      return;
    }

    fetchTrips();
    fetchDrivers();
  }, [router]);

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

    if (Array.isArray(res)) {
      setDrivers(res);
    } else if (Array.isArray(res?.drivers)) {
      setDrivers(res.drivers);
    } else if (Array.isArray(res?.data)) {
      setDrivers(res.data);
    } else {
      setDrivers([]);
    }
  } catch {
    setDrivers([]);
  }
};


  const handleView = (type: "none" | "trips" | "drivers") => {
    setView(type);
    setTripPage(1);
    setDriverPage(1);
  };

  /* ================= TRIPS ================= */

  const sortedTrips =
    tripSort === "time"
      ? [...trips].sort((a, b) =>
          (a.departureTime || "").localeCompare(b.departureTime || "")
        )
      : tripSort === "name"
      ? [...trips].sort((a, b) =>
          a.destination.localeCompare(b.destination)
        )
      : trips;

  const tripTotalPages = Math.ceil(sortedTrips.length / ITEMS_PER_PAGE);

  const paginatedTrips = sortedTrips.slice(
    (tripPage - 1) * ITEMS_PER_PAGE,
    tripPage * ITEMS_PER_PAGE
  );

  /* ================= DRIVERS ================= */

  const safeDrivers = Array.isArray(drivers) ? drivers : [];

  const filteredDrivers =
    driverLicenseFilter === "all"
      ? safeDrivers
      : safeDrivers.filter(d => d.licenseType === driverLicenseFilter);

  const sortedDrivers =
    driverSort === "name"
      ? [...filteredDrivers].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      : filteredDrivers;

  const driverTotalPages = Math.ceil(
    sortedDrivers.length / ITEMS_PER_PAGE
  );

  const paginatedDrivers = sortedDrivers.slice(
    (driverPage - 1) * ITEMS_PER_PAGE,
    driverPage * ITEMS_PER_PAGE
  );

  /* ================= UI ================= */

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-black">
      <Navbar setView={handleView} currentView={view} />

      <main className="flex-1 p-8">
        {/* STATS */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold">Total Trips</h3>
            <p className="text-3xl font-bold text-blue-700">{trips.length}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold">Total Drivers</h3>
            <p className="text-3xl font-bold text-green-700">{safeDrivers.length}</p>
          </div>
        </div>

        {/* ================= TRIPS ================= */}
        {view === "trips" && (
          <div className="rounded-xl bg-white shadow">
            <h2 className="border-b p-6 text-xl font-bold">Trips</h2>

            {/* SORT */}
            <div className="p-4">
              <select
                value={tripSort}
                onChange={e => {
                  setTripSort(e.target.value as any);
                  setTripPage(1);
                }}
                className="border rounded px-4 py-2 bg-white"
              >
                <option value="none">Normal Order</option>
                <option value="time">Early Departure</option>
                <option value="name">Destination (A–Z)</option>
              </select>
            </div>

            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">Departure</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Destination</th>
                  <th className="px-4 py-3 text-left">Time</th>
                </tr>
              </thead>

              <tbody>
                {loadingTrips ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  paginatedTrips.map(trip => (
                    <tr key={trip._id} className="border-b hover:bg-gray-100">
                      <td className="px-4 py-3">{trip.departure}</td>
                      <td className="px-4 py-3">
                        {new Date(trip.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{trip.destination}</td>
                      <td className="px-4 py-3">{trip.departureTime || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex justify-between p-4">
              <button
                disabled={tripPage === 1}
                onClick={() => setTripPage(p => p - 1)}
                className="border px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span>
                Page {tripPage} of {tripTotalPages}
              </span>

              <button
                disabled={tripPage === tripTotalPages}
                onClick={() => setTripPage(p => p + 1)}
                className="border px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ================= DRIVERS ================= */}
        {view === "drivers" && (
          <div className="rounded-xl bg-white shadow">
            <h2 className="border-b p-6 text-xl font-bold">Drivers</h2>

            {/* FILTERS */}
            <div className="flex gap-4 p-4">
              <select
                value={driverLicenseFilter}
                onChange={e => {
                  setDriverLicenseFilter(e.target.value);
                  setDriverPage(1);
                }}
                className="border rounded px-4 py-2 bg-white"
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
                className="border rounded px-4 py-2 bg-white"
              >
                <option value="none">Normal</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>

            <table className="w-full">
              <thead className="bg-gray-200">
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

            {/* PAGINATION */}
            <div className="flex justify-between p-4">
              <button
                disabled={driverPage === 1}
                onClick={() => setDriverPage(p => p - 1)}
                className="border px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span>
                Page {driverPage} of {driverTotalPages}
              </span>

              <button
                disabled={driverPage === driverTotalPages}
                onClick={() => setDriverPage(p => p + 1)}
                className="border px-4 py-2 rounded disabled:opacity-50"
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