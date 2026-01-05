"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DriverNavbar from "../driver/component/navbar";
import { getAssignedTrips } from "../../services/trip.api";

interface Trip {
  id: number;
  status: "Pending" | "Ongoing" | "Completed";
  pickup: string;
  drop: string;
  createdAt: string;
}

export default function DriverPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [view, setView] = useState<"none" | "trips">("none"); // Default: hidden

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);

      if (payload.role !== "driver") {
        router.push("/");
        return;
      }
    } catch {
      localStorage.removeItem("token");
      router.push("/");
    }
  }, [router]);

  const fetchTrips = async () => {
    try {
      setLoadingTrips(true);
      const data = await getAssignedTrips(); // Admin-created trips
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleView = async (type: "trips") => {
    if (type === "trips" && trips.length === 0) await fetchTrips();
    setView(type);
  };

  if (!user) return <div className="p-10 text-gray-700">Loading...</div>;

  const totalTrips = trips.length;
  const ongoingTrips = trips.filter(t => t.status === "Ongoing").length;
  const completedTrips = trips.filter(t => t.status === "Completed").length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Driver Navbar */}
      <DriverNavbar setView={handleView} currentView={view} />

      <main className="p-8 flex-1">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Total Trips</h3>
            <p className="text-2xl font-bold text-gray-900">{totalTrips}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Ongoing Trips</h3>
            <p className="text-2xl font-bold text-blue-600">{ongoingTrips}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Completed Trips</h3>
            <p className="text-2xl font-bold text-green-600">{completedTrips}</p>
          </div>
        </div>

        {/* Trips table (read-only) */}
        {view === "trips" && (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-xl font-bold p-6 border-b border-gray-200 text-gray-900">
              Assigned Trips
            </h2>
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3">Trip ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Pickup</th>
                  <th className="p-3">Drop</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {loadingTrips ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-600">
                      Loading trips...
                    </td>
                  </tr>
                ) : trips.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-600">
                      No trips assigned by admin
                    </td>
                  </tr>
                ) : (
                  trips.map(trip => (
                    <tr key={trip.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">#{trip.id}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            trip.status === "Ongoing"
                              ? "bg-blue-100 text-blue-700"
                              : trip.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-800">{trip.pickup}</td>
                      <td className="p-3 text-gray-800">{trip.drop}</td>
                      <td className="p-3 text-gray-500">{new Date(trip.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
