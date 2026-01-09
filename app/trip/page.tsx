"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrips, deleteTrip } from "@/services/trip.api";
import { Trip } from "@/types/trip";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";

/* ===== CONSTANT ===== */
const ITEMS_PER_PAGE = 5;

export default function TripsPage() {
  const router = useRouter();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ===== FILTERS (SAME AS ADMIN CODE) ===== */
  const [tripSort, setTripSort] =
    useState<"none" | "time" | "name">("none");

  /* ===== PAGINATION ===== */
  const [tripPage, setTripPage] = useState(1);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await getTrips();
      setTrips(data);
    } catch (err) {
      setError("Failed to fetch trips");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      await deleteTrip(id);
      setTrips(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      alert("Failed to delete trip");
      console.error(err);
    }
  };

  /* ===== SORT LOGIC ===== */
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

  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.ceil(sortedTrips.length / ITEMS_PER_PAGE);

  const paginatedTrips = sortedTrips.slice(
    (tripPage - 1) * ITEMS_PER_PAGE,
    tripPage * ITEMS_PER_PAGE
  );

  if (loading)
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <p className="p-10 text-black">Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <p className="p-10 text-red-500">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 flex-1">
          {/* ===== HEADER ===== */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-black">Trips</h1>

            <button
              onClick={() => router.push("/trip/create")}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Create Trip
            </button>
          </div>

          {/* ===== FILTER (SAME AS ADMIN) ===== */}
          <div className="mb-4">
            <select
              value={tripSort}
              onChange={(e) => {
                setTripSort(e.target.value as any);
                setTripPage(1);
              }}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-black"
            >
              <option value="none">Normal Order</option>
              <option value="time">Early Departure First</option>
              <option value="name">Destination (A–Z)</option>
            </select>
          </div>

          {paginatedTrips.length === 0 ? (
            <p className="text-black font-bold">No trips saved yet ❌</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Departure</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Destination</th>
                    <th className="px-4 py-3 text-left">Departure Time</th>
                    <th className="px-4 py-3 text-left">Arrival Time</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTrips.map(trip => (
                    <tr key={trip._id} className="border-b">
                      <td className="px-4 py-3 text-black">
                        {trip.departure}
                      </td>

                      <td className="px-4 py-3 text-black">
                        {new Date(trip.date).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 text-black">
                        {trip.destination}
                      </td>

                      <td className="px-4 py-3 text-black">
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

                      <td className="px-4 py-3 text-black">
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
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              router.push(`/trip/update/${trip._id}`)
                            }
                            className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(trip._id!)}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ===== PAGINATION ===== */}
              <div className="flex justify-between items-center p-4">
                <button
                  disabled={tripPage === 1}
                  onClick={() => setTripPage(p => p - 1)}
                  className="border px-4 py-2 rounded bg-white text-black disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm text-black">
                  Page {tripPage} of {totalPages}
                </span>

                <button
                  disabled={tripPage === totalPages}
                  onClick={() => setTripPage(p => p + 1)}
                  className="border px-4 py-2 rounded bg-white text-black disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}