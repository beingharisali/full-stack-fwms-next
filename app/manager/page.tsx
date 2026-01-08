"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../manager/component/navbar";
import { getTrips } from "@/services/trip.api";
import { Trip } from "@/types/trip";
import { getDrivers } from "@/services/driver.api";

export default function ManagerPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<"none" | "trips" | "drivers">("none");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);

  // 🔹 FILTER STATES
  const [driverLicenseFilter, setDriverLicenseFilter] = useState("all");
  const [tripSort, setTripSort] = useState<
    "none" | "time" | "name"
  >("none");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      localStorage.removeItem("token");
      router.push("/");
      return;
    }

    const driverFetcher = async () => {
      try {
        const res = await getDrivers();
        setDrivers(res);
      } catch {
        console.log("error occured in fetching drivers");
      }
    };

    driverFetcher();
    fetchTripsSummary();
  }, [router]);

  const fetchTripsSummary = async () => {
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

  const handleView = (type: "trips" | "drivers") => {
    if (type === "trips" && trips.length === 0) {
      fetchTripsSummary();
    }
    setView(type);
  };

  // 🔹 FILTERED DRIVERS
  const filteredDrivers =
    driverLicenseFilter === "all"
      ? drivers
      : drivers.filter(
          driver => driver.licenseType === driverLicenseFilter
        );

  // 🔹 SORTED TRIPS (TIME + NAME)
  const sortedTrips =
    tripSort === "time"
      ? [...trips].sort((a, b) =>
          (a.departureTime || "").localeCompare(
            b.departureTime || ""
          )
        )
      : tripSort === "name"
      ? [...trips].sort((a, b) =>
          a.destination.localeCompare(b.destination)
        )
      : trips;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar setView={handleView} currentView={view} />

      <main className="flex-1 bg-gray-50 p-8">
        {/* ---------- Stats ---------- */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Total Trips
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {trips.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Total Drivers
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {drivers.length}
            </p>
          </div>
        </div>

        {/* ---------- Trips ---------- */}
        {view === "trips" && (
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <h2 className="border-b p-6 text-xl font-bold text-gray-900">
              Trips
            </h2>

            {/* 🔆 BRIGHT SORT DROPDOWN */}
            <div className="p-4">
              <select
                value={tripSort}
                onChange={e =>
                  setTripSort(
                    e.target.value as "none" | "time" | "name"
                  )
                }
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="none">Normal Order</option>
                <option value="time">Early Departure First</option>
                <option value="name">
                  Destination Name (A–Z)
                </option>
              </select>
            </div>

            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="px-4 py-3">Departure</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Departure Time</th>
                </tr>
              </thead>

              <tbody className="text-gray-800">
                {loadingTrips ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-600">
                      Loading trips...
                    </td>
                  </tr>
                ) : (
                  sortedTrips.map(trip => (
                    <tr
                      key={trip._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        {trip.departure}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(
                          trip.date
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {trip.destination}
                      </td>
                      <td className="px-4 py-3">
                        {trip.departureTime || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ---------- Drivers ---------- */}
        {view === "drivers" && (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Drivers
            </h2>

            <div className="mb-4">
              <select
                value={driverLicenseFilter}
                onChange={e =>
                  setDriverLicenseFilter(e.target.value)
                }
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All License Types</option>
                <option value="LTV">LTV</option>
                <option value="HTV">HTV</option>
                <option value="MCV">MCV</option>
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
                {filteredDrivers.map(driver => (
                  <tr
                    key={driver._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {driver.name}
                    </td>
                    <td className="px-4 py-3">
                      {driver.licenseNumber}
                    </td>
                    <td className="px-4 py-3">
                      {driver.licenseType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
