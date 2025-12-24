"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrips, deleteTrip } from "@/services/trip.api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrips()
      .then((data) => {   
        setTrips(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const canCreateTrip = user?.role === "admin" || user?.role === "manager";
  const canEditTrip = user?.role === "admin" || user?.role === "manager";

  if (loading) return <div className="flex justify-center items-center h-64"><p>Loading...</p></div>;

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Trips</h1>
          {canCreateTrip && (
            <button 
              onClick={() => router.push("/trip/create")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Trip
            </button>
          )}
        </div>

        {trips.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No trips found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  {canEditTrip && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.departure}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.date}</td>
                    {canEditTrip && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => router.push(`/trip/update/${trip.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(trip.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}