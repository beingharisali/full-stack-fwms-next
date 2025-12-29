"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getTripById, updateTrip, deleteTrip } from "@/services/trip.api";
import { Trip } from "@/types/trip";
import Sidebar from "../../../component/sidebar";
import Navbar from "../../../component/navbar";

export default function UpdateTrip() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTrip();
    }
  }, [id]);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const data = await getTripById(id);
      setTrip({
        ...data,
        date: new Date(data.date)
      });
    } catch (err) {
      setError("Failed to fetch trip");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!trip || !trip.departure || !trip.destination || !trip.date || !trip.departureTime || !trip.arrivalTime) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setSaving(true);
      await updateTrip(id, trip);
      router.push("/trip");
    } catch (err) {
      alert("Failed to update trip");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      await deleteTrip(id);
      router.push("/trip");
    } catch (err) {
      alert("Failed to delete trip");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar/>
        <div className="flex-1 flex flex-col">
          <Navbar/>
          <div className="flex justify-center items-center flex-1">
            <p className="text-lg text-gray-800">Loading trip...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar/>
        <div className="flex-1 flex flex-col">
          <Navbar/>
          <div className="flex justify-center items-center flex-1">
            <p className="text-red-500 font-bold text-lg">{error || "Trip not found"} ❌</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <Navbar/>
        <main className="flex justify-center items-center flex-1 p-4">
          <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Trip</h1>

            <div className="flex flex-col gap-4">
              <input
                value={trip.departure}
                placeholder="Departure"
                onChange={(e) => setTrip({ ...trip, departure: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={saving}
              />

              <input
                value={trip.destination}
                placeholder="Destination"
                onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={saving}
              />

              <input
                type="date"
                value={formatDateForInput(trip.date)}
                onChange={(e) => setTrip({ ...trip, date: new Date(e.target.value) })}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={saving}
              />

              <input
                type="time"
                value={trip.departureTime || ""}
                placeholder="Departure Time"
                onChange={(e) => setTrip({ ...trip, departureTime: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={saving}
              />

              <input
                type="time"
                value={trip.arrivalTime || ""}
                placeholder="Arrival Time"
                onChange={(e) => setTrip({ ...trip, arrivalTime: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={saving}
              />

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
