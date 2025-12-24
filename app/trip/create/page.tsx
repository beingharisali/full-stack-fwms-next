"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTrip } from "../../../services/trip.api";
import { Trip } from "../../../types/trip";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CreateTrip() {
  const router = useRouter();

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(""); 
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const handleCreate = async () => {
    if (!departure || !destination || !date || !departureTime || !arrivalTime) {
      alert("Fill all fields");
      return;
    }

    const payload = {
      departure,
      destination,
      departureTime,
      arrivalTime,
      date,
    };

    await createTrip(payload);
    router.push("/trip");
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Trip</h1>
        
        <div className="space-y-4">
          <input
            placeholder="Departure"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="time"
            placeholder="Departure Time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="time"
            placeholder="Arrival Time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button 
            onClick={handleCreate}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Create Trip
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
