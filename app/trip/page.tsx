"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrips, deleteTrip } from "@/services/trip.api";

export interface Trip {
  id: string;
  departure: string;
  destination: string;
  arrivalTime: string;
  departureTime: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrips()
      .then((data) => {
        setTrips(trips);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen font-sans bg-[#f0f8ff]">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-500 text-white p-4 px-10 text-2xl font-bold shadow-md">
        <div>Trips</div>
        <button
          onClick={() => router.push("/trips/create")}
          className="bg-gray-800 text-white px-3 py-1 rounded cursor-pointer text-base"
        >
          Create Trip
        </button>
      </div>

      {/* Table */}
      <div className="p-10">
        {trips.length === 0 ? (
          <p className="text-red-500 font-bold">No trips saved yet ❌</p>
        ) : (
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th className="p-2">Departure</th>
                <th className="p-2">Date</th>
                <th className="p-2">Destination</th>
                <th className="p-2">Departure Time</th>
                <th className="p-2">Arrival Time</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="text-center text-black">
                  <td className="p-2">{trip.departure}</td>
                  <td className="p-2">{trip.date}</td>
                  <td className="p-2">{trip.destination}</td>
                  <td className="p-2">{trip.departureTime || "-"}</td>
                  <td className="p-2">{trip.arrivalTime || "-"}</td>
                  <td className="p-2 flex justify-center gap-2">
                    <button
                      onClick={() => router.push(`/trips/update/${trip.id}`)}
                      className="bg-gray-800 text-white rounded px-3 py-1 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="bg-gray-800 text-white rounded px-3 py-1 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
