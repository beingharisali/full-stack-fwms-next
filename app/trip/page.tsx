"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import LoadingBar from "../component/LoadingBar";
import { getTrips, deleteTrip } from "@/services/trip.api";
import { Trip } from "@/types/trip";

const ITEMS_PER_PAGE = 5;

const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  delta = 2
) => {
  const range: (number | string)[] = [];
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  range.push(1);

  if (left > 2) range.push("...");

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < totalPages - 1) range.push("...");

  if (totalPages > 1) range.push(totalPages);

  return range;
};

export default function TripsPage() {
  const router = useRouter();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch {
      setError("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t._id !== id));
  };

  let filteredTrips = trips.filter((trip) =>
    `${trip.departure} ${trip.destination}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  filteredTrips.sort((a, b) => {
    const nameA = `${a.departure} ${a.destination}`.toLowerCase();
    const nameB = `${b.departure} ${b.destination}`.toLowerCase();

    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  const totalPages = Math.ceil(filteredTrips.length / ITEMS_PER_PAGE);
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <LoadingBar title="Loading Trips" duration={2} />;

  return (
    <div className="flex min-h-screen bg-white text-black flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Trips</h1>
            <button
              onClick={() => router.push("/trip/create")}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Create Trip
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-4 mb-4 flex-wrap">
            <input
              placeholder="Search by departure or destination..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 border px-3 py-2 rounded"
            />

            <button
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
              className="border px-4 py-2 rounded bg-black text-white"
            >
              {sortOrder === "asc" ? "A → Z" : "Z → A"}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full border border-black">
              <thead className="bg-gray-200 border border-black">
                <tr>
                  <th className="px-4 py-3 border text-left">Departure</th>
                  <th className="px-4 py-3 border text-left">Date</th>
                  <th className="px-4 py-3 border text-left">Destination</th>
                  <th className="px-4 py-3 border text-left">Departure Time</th>
                  <th className="px-4 py-3 border text-left">Arrival Time</th>
                  <th className="px-4 py-3 border text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedTrips.map((trip) => (
                  <tr key={trip._id} className="border border-black">
                    <td className="px-4 py-3">{trip.departure}</td>
                    <td className="px-4 py-3">
                      {new Date(trip.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{trip.destination}</td>
                    <td className="px-4 py-3">{trip.departureTime || "-"}</td>
                    <td className="px-4 py-3">{trip.arrivalTime || "-"}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => router.push(`/trip/update/${trip._id}`)}
                        className="bg-black text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(trip._id!)}
                        className="bg-gray-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTrips.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No trips found.
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-4 sm:justify-between">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <div className="flex flex-wrap gap-1 justify-center">
                  {getPaginationRange(currentPage, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={i} className="px-2 py-1 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`px-3 py-1 border rounded text-sm ${
                          p === currentPage ? "bg-black text-white" : ""
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
