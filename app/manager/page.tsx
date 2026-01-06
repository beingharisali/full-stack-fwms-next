"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../manager/component/navbar";
import { getTrips } from "@/services/trip.api";
import { Trip } from "@/types/trip";

export default function ManagerPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<"none" | "trips" | "drivers">("none");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);

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

    setDrivers([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Ali Khan" },
    ]);

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
            <p className="text-gray-600">All trips in system</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              Total Drivers
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {drivers.length}
            </p>
            <p className="text-gray-600">Drivers added by admin</p>
          </div>
        </div>

        {/* ---------- Trips ---------- */}
        {view === "trips" && (
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <h2 className="border-b p-6 text-xl font-bold text-gray-900">
              Trips
            </h2>

            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="px-4 py-3">Departure</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Departure Time</th>
                  <th className="px-4 py-3">Arrival Time</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-800">
                {loadingTrips ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-600">
                      Loading trips...
                    </td>
                  </tr>
                ) : trips.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-600">
                      No trips available
                    </td>
                  </tr>
                ) : (
                  trips.map(trip => (
                    <tr
                      key={trip._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{trip.departure}</td>
                      <td className="px-4 py-3">
                        {new Date(trip.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{trip.destination}</td>

                      <td className="px-4 py-3">
                        {trip.departureTime
                          ? new Date(
                              `1970-01-01T${trip.departureTime}`
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "-"}
                      </td>

                      <td className="px-4 py-3">
                        {trip.arrivalTime
                          ? new Date(
                              `1970-01-01T${trip.arrivalTime}`
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "-"}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            router.push(`/trip/update/${trip._id}`)
                          }
                          className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-500 transition"
                        >
                          Edit
                        </button>
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

            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                </tr>
              </thead>

              <tbody className="text-gray-800">
                {drivers.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-6 text-center text-gray-600">
                      No drivers found
                    </td>
                  </tr>
                ) : (
                  drivers.map(driver => (
                    <tr
                      key={driver.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{driver.id}</td>
                      <td className="px-4 py-3">{driver.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}