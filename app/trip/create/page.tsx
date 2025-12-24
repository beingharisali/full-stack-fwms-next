"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTrip } from "../../../services/trip.api";
import { Trip } from "../../../types/trip";

export default function CreateTrip() {
  const router = useRouter();

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const handleCreate = async () => {
    if (!departure || !destination || !date || !departureTime || !arrivalTime) {
      alert("Please fill all fields!");
      return;
    }

    const payload: Trip = {
      departure,
      destination,
      date: new Date(date),
      departureTime,
      arrivalTime,
    };

    try {
      await createTrip(payload);
      router.push("/trips");
    } catch (error) {
      console.error("Failed to create trip:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Trip 📝</h1>

        <div className="flex flex-col gap-4">
          <input
            placeholder="Departure"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="time"
            placeholder="Departure Time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="time"
            placeholder="Arrival Time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white py-3 px-5 rounded-lg font-bold mt-4 hover:bg-blue-600 transition"
          >
            Save Trip
          </button>
        </div>
      </div>
    </div>
  );
}
