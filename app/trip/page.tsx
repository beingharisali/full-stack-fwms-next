"use client";

import { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { getTrips } from "@/services/trip.api";
import { Trip } from "@/types/trip";

const ITEMS_PER_PAGE = 5;

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  /* PAGINATION */
  const [tripPage, setTripPage] = useState(1);

  /* FILTER */
  const [destinationFilter, setDestinationFilter] = useState("all");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setTrips(await getTrips());
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredTrips =
    destinationFilter === "all"
      ? trips
      : trips.filter(trip => trip.destination === destinationFilter);

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(filteredTrips.length / ITEMS_PER_PAGE);

  const paginatedTrips = filteredTrips.slice(
    (tripPage - 1) * ITEMS_PER_PAGE,
    tripPage * ITEMS_PER_PAGE
  );

  /* UNIQUE DESTINATIONS FOR FILTER DROPDOWN */
  const uniqueDestinations = Array.from(new Set(trips.map(t => t.destination)));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 p-8">
          <div className="rounded-xl bg-white shadow-md">
            <h2 className="border-b p-6 text-xl font-bold text-gray-900">
              Trips
            </h2>

            {/* FILTER */}
            <div className="p-4">
              <select
                value={destinationFilter}
                onChange={e => {
                  setDestinationFilter(e.target.value);
                  setTripPage(1); // reset to first page
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Destinations</option>
                {uniqueDestinations.map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>

            {/* TABLE */}
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
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedTrips.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center">
                      No trips found
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
                      <td className="px-4 py-3">{trip.departureTime || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* PAGINATION – MANAGER STYLE */}
            <div className="flex items-center justify-between p-4">
              <button
                disabled={tripPage === 1}
                onClick={() => setTripPage(p => p - 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>

              {/* PAGE NUMBERS */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setTripPage(page)}
                    className={`px-3 py-1 border rounded ${
                      tripPage === page
                        ? "bg-gray-300 font-bold"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={tripPage === totalPages || totalPages === 0}
                onClick={() => setTripPage(p => p + 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
