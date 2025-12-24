"use client";

import { useEffect, useState } from "react";
import { Trip } from "@/types/trip";
import { useParams, useRouter } from "next/navigation";
import { getTripById, updateTrip, deleteTrip, createTrip ,getTrips } from "@/services/trip.api";

export default function UpdateTrip() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getTripById(id)
      .then((data) => setTrip(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!trip) return <p>Trip not found</p>;

  const handleSave = async () => {
    if (!trip) return;

    try {
      await updateTrip(id!, trip);
      router.push("/trips");
    } catch (error) {
      console.error("Failed to update trip:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this trip?")) return;

    try {
      await deleteTrip(id!);
      router.push("/trips");
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-[300px] mx-auto mt-10">
      <input
        placeholder="Departure"
        value={trip.departure}
        onChange={(e) => setTrip({ ...trip, departure: e.target.value })}
        className="border p-2 rounded"
      />

      <input
        placeholder="Destination"
        value={trip.destination}
        onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
        className="border p-2 rounded"
      />

      <input
        type="date"
        value={trip.date.toISOString().split("T")[0]} // Date → YYYY-MM-DD
        onChange={(e) => setTrip({ ...trip, date: new Date(e.target.value) })} // string → Date
        className="border p-2 rounded"
      />

      <input
        type="time"
        value={trip.departureTime}
        onChange={(e) => setTrip({ ...trip, departureTime: e.target.value })}
        className="border p-2 rounded"
      />

      <input
        type="time"
        value={trip.arrivalTime}
        onChange={(e) => setTrip({ ...trip, arrivalTime: e.target.value })}
        className="border p-2 rounded"
      />

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
