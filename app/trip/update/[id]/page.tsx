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
    if (id) fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const data = await getTripById(id);
      setTrip({
        ...data,
        date: new Date(data.date),
      });
    } catch (err) {
      setError("Failed to fetch trip");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (
      !trip ||
      !trip.departure ||
      !trip.destination ||
      !trip.date ||
      !trip.departureTime ||
      !trip.arrivalTime
    ) {
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

  const formatDateForInput = (date: Date) =>
    date.toISOString().split("T")[0];

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Navbar />
          <div className="flex flex-1 items-center justify-center">
            <p className="text-lg text-gray-700">Loading trip...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error || !trip) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Navbar />
          <div className="flex flex-1 items-center justify-center">
            <p className="text-lg font-semibold text-red-500">
              {error || "Trip not found"} ❌
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Form ---------- */
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex flex-1 flex-col bg-gray-50">
        <Navbar />

        <main className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Edit Trip ✏️
            </h1>

            <div className="flex flex-col gap-4">
              <input
                value={trip.departure}
                placeholder="Departure"
                onChange={(e) =>
                  setTrip({ ...trip, departure: e.target.value })
                }
                disabled={saving}
                className="rounded-lg border border-gray-300 p-3 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                value={trip.destination}
                placeholder="Destination"
                onChange={(e) =>
                  setTrip({ ...trip, destination: e.target.value })
                }
                disabled={saving}
                className="rounded-lg border border-gray-300 p-3 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                value={formatDateForInput(trip.date)}
                onChange={(e) =>
                  setTrip({ ...trip, date: new Date(e.target.value) })
                }
                disabled={saving}
                className="rounded-lg border border-gray-300 p-3 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="time"
                value={trip.departureTime || ""}
                onChange={(e) =>
                  setTrip({ ...trip, departureTime: e.target.value })
                }
                disabled={saving}
                className="rounded-lg border border-gray-300 p-3 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="time"
                value={trip.arrivalTime || ""}
                onChange={(e) =>
                  setTrip({ ...trip, arrivalTime: e.target.value })
                }
                disabled={saving}
                className="rounded-lg border border-gray-300 p-3 text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white
                    hover:bg-blue-500 transition disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update"}
                </button>

                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-red-500 py-2 font-semibold text-white
                    hover:bg-red-400 transition disabled:opacity-50"
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
