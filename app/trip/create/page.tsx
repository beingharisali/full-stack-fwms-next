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

    const payload: Omit<Trip, "_id" | "createdAt" | "updatedAt"> = {
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
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <div className="flex flex-1 bg-gray-50">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Create Trip 📝
            </h1>

            <div className="flex flex-col gap-4">
              <input
                placeholder="Departure"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                disabled={loading}
                className="rounded-lg border border-gray-300 p-3 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={loading}
                className="rounded-lg border border-gray-300 p-3 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={loading}
                className="rounded-lg border border-gray-300 p-3 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                disabled={loading}
                className="rounded-lg border border-gray-300 p-3 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                disabled={loading}
                className="rounded-lg border border-gray-300 p-3 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleCreate}
                disabled={loading}
                className="mt-4 rounded-lg bg-blue-600 py-3 font-bold text-white
                  hover:bg-blue-500 transition disabled:opacity-50"
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
