"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTrip } from "../../../services/trip.api";
import { Trip } from "../../../types/trip";
import Sidebar from "../../component/sidebar";
import Navbar from "../../component/navbar";

export default function CreateTrip() {
  const router = useRouter();

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!departure || !destination || !date || !departureTime || !arrivalTime) {
      alert("Please fill all fields!");
      return;
    }

    const payload: Omit<Trip, '_id' | 'createdAt' | 'updatedAt'> = {
      departure,
      destination,
      date: new Date(date),
      departureTime,
      arrivalTime,
    };

    try {
      setLoading(true);
      await createTrip(payload as Trip);
      router.push("/trip");
    } catch (error) {
      console.error("Failed to create trip:", error);
      alert("Failed to create trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      <Navbar/>
      <div className="flex flex-1">
        <Sidebar/>
        <main className="flex justify-center items-center flex-1 p-4">
          <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Trip 📝</h1>

            <div className="flex flex-col gap-4">
              <input
                placeholder="Departure"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={loading}
              />

              <input
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={loading}
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={loading}
              />

              <input
                type="time"
                placeholder="Departure Time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={loading}
              />

              <input
                type="time"
                placeholder="Arrival Time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={loading}
              />

              <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-gray-800 text-white py-3 px-5 rounded-lg font-bold mt-4 hover:bg-gray-700 transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Save Trip"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
