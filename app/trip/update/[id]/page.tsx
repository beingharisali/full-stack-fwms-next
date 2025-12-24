"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export interface Trip {
  id: string;
  name: string;
  date: string;
  destination: string;
  departureTime?: string;
  arrivalTime?: string;
}

export default function UpdateTrip() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>({
    id: id!,
    name: "",
    date: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
  });

  if (!trip)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
        <p className="text-red-800 font-bold text-lg">Trip not found ❌</p>
      </div>
    );

  const handleSave = () => {
    if (
      !trip.name ||
      !trip.date ||
      !trip.destination ||
      !trip.departureTime ||
      !trip.arrivalTime
    ) {
      alert("Please fill all fields!");
      return;
    }

    console.log("Save trip:", trip);
    router.push("/trips");
  };

  const handleDelete = () => {
    console.log("Delete trip:", trip.id);
    router.push("/trips");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Trip</h1>

        <div className="flex flex-col gap-4">
          <input
            value={trip.name}
            placeholder="Trip Name"
            onChange={(e) => setTrip({ ...trip, name: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={trip.date}
            onChange={(e) => setTrip({ ...trip, date: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={trip.destination}
            placeholder="Destination"
            onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="time"
            value={trip.departureTime || ""}
            onChange={(e) =>
              setTrip({ ...trip, departureTime: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="time"
            value={trip.arrivalTime || ""}
            onChange={(e) => setTrip({ ...trip, arrivalTime: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
