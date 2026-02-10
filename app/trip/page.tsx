"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import LoadingBar from "../component/LoadingBar";
import AssignTripModal from "../component/AssignTripModal";
import { getTrips, deleteTrip } from "@/services/trip.api";
import { Trip } from "@/types/trip";

const ITEMS_PER_PAGE = 5;

const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  delta = 2,
) => {
  const range: (number | string)[] = [];
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  range.push(1);
  if (left > 2) range.push("...");
  for (let i = left; i <= right; i++) range.push(i);
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

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

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

  const handleAssignClick = (trip: Trip) => {
    setSelectedTripId(trip._id || "");
    setSelectedTrip(trip);
    setIsAssignModalOpen(true);
  };

  const handleAssignSuccess = () => {
    fetchTrips();
  };

  let filteredTrips = trips.filter((trip) =>
    `${trip.departure} ${trip.destination}`
      .toLowerCase()
      .includes(search.toLowerCase()),
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
    currentPage * ITEMS_PER_PAGE,
  );

  if (loading) return <LoadingBar title="Loading Trips" duration={2} />;

  return (
    <div className="flex min-h-screen bg-white text-black flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-8">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Trips</h1>
            <button
              onClick={() => router.push("/trip/create")}
              className="bg-black text-white px-6 py-2.5 rounded-md text-sm font-medium"
            >
              Create Trip
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* SEARCH + SORT */}
          <div className="flex gap-4 mb-6 flex-col sm:flex-row">
            <input
              placeholder="Search by departure or destination..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 border border-black px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
              className="border border-gray-300 px-5 py-3 rounded-md bg-white font-medium"
            >
              {sortOrder === "asc" ? "A to Z" : "Z to A"}
            </button>
          </div>

          {/* TABLE */}
          <div className="border border-black  overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200 border-b border-black">
                <tr>
                  {[
                    "Departure",
                    "Date",
                    "Destination",
                    "Departure Time",
                    "Arrival Time",
                    "Assigned Driver",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedTrips.map((trip) => (
                  <tr key={trip._id} className="border-b border-black">
                    <td className="px-6 py-4 text-sm">{trip.departure}</td>
                    <td className="px-6 py-4 text-sm text-black">
                      {new Date(trip.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">{trip.destination}</td>
                    <td className="px-6 py-4 text-sm text-black">
                      {trip.departureTime || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-black">
                      {trip.arrivalTime || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {trip.assignedDriver ? (
                        <span className="font-medium">
                          {trip.assignedDriver.name}
                        </span>
                      ) : (
                        <span className="italic text-gray-400">
                          Not assigned
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200">
                        {trip.status || "unassigned"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAssignClick(trip)}
                          className="bg-green-500 text-white px-3 py-1.5 rounded text-xs"
                        >
                          Assign
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/trip/update/${trip._id}`)
                          }
                          className="bg-black text-white px-3 py-1.5 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(trip._id!)}
                          className="bg-gray-700 text-white px-3 py-1.5 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTrips.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No trips found
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 border-t">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(p - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  ← Prev
                </button>

                <div className="flex gap-1">
                  {getPaginationRange(currentPage, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={i} className="px-3 py-2">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`px-3 py-2 border rounded ${
                          p === currentPage
                            ? "bg-black text-white"
                            : ""
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(p + 1, totalPages),
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AssignTripModal
        isOpen={isAssignModalOpen}
        tripId={selectedTripId}
        assignedDriver={selectedTrip?.assignedDriver}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignSuccess}
      />
    </div>
  );
}