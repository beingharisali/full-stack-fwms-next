"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../manager/component/navbar";
import { getTrips } from "@/services/trip.api";
import { Trip } from "@/types/trip";
import { getDrivers } from "@/services/driver.api";

const ITEMS_PER_PAGE = 5;

export default function ManagerPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<"none" | "trips" | "drivers">("none");

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
      setTrips(await getTrips());
    } finally {
      setLoadingTrips(false);
    }
  };

  const fetchDrivers = async () => {
    setDrivers(await getDrivers());
  };

  const handleView = (type: "trips" | "drivers") => {
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
  const filteredDrivers =
    driverLicenseFilter === "all"
      ? drivers
      : drivers.filter(d => d.licenseType === driverLicenseFilter);

  const sortedDrivers =
    driverSort === "name"
      ? [...filteredDrivers].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      : filteredDrivers;

  const driverTotalPages = Math.ceil(sortedDrivers.length / ITEMS_PER_PAGE);
  const paginatedDrivers = sortedDrivers.slice(
    (driverPage - 1) * ITEMS_PER_PAGE,
    driverPage * ITEMS_PER_PAGE
  );

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar setView={handleView} currentView={view} />

      <main className="flex-1 p-8">
        {/* ================= TRIPS ================= */}
        {view === "trips" && (
          <div className="rounded-xl bg-white shadow-md">
            <h2 className="border-b p-6 text-xl font-bold text-gray-900">
              Trips
            </h2>

            <div className="p-4">
              <select
                value={tripSort}
                onChange={e => {
                  setTripSort(e.target.value as any);
                  setTripPage(1);
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="none">Normal Order</option>
                <option value="time">Early Departure First</option>
                <option value="name">Destination Name (A–Z)</option>
              </select>
            </div>

            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="px-4 py-3">Departure</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>

              <tbody className="text-gray-800">
                {loadingTrips ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  paginatedTrips.map(trip => (
                    <tr key={trip._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{trip.departure}</td>
                      <td className="px-4 py-3">
                        {new Date(trip.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{trip.destination}</td>
                      <td className="px-4 py-3">
                        {trip.departureTime || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between p-4">
              <button
                disabled={tripPage === 1}
                onClick={() => setTripPage(p => p - 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {tripPage} of {tripTotalPages}
              </span>

              <button
                disabled={tripPage === tripTotalPages}
                onClick={() => setTripPage(p => p + 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ================= DRIVERS ================= */}
        {view === "drivers" && (
          <div className="rounded-xl bg-white shadow-md">
            <h2 className="border-b p-6 text-xl font-bold text-gray-900">
              Drivers
            </h2>

            <div className="flex flex-wrap gap-4 p-4">
              <select
                value={driverLicenseFilter}
                onChange={e => {
                  setDriverLicenseFilter(e.target.value);
                  setDriverPage(1);
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All License Types</option>
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
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="none">Normal Order</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>

            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">License No</th>
                  <th className="px-4 py-3">License Type</th>
                </tr>
              </thead>

              <tbody className="text-gray-800">
                {paginatedDrivers.map(driver => (
                  <tr key={driver._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{driver.name}</td>
                    <td className="px-4 py-3">{driver.licenseNumber}</td>
                    <td className="px-4 py-3">{driver.licenseType}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between p-4">
              <button
                disabled={driverPage === 1}
                onClick={() => setDriverPage(p => p - 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {driverPage} of {driverTotalPages}
              </span>

              <button
                disabled={driverPage === driverTotalPages}
                onClick={() => setDriverPage(p => p + 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-100 disabled:opacity-50"
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
