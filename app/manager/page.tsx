"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { getTrips } from "../../services/trip.api";

interface Trip {
  id: number;
  driverName: string;
  status: "Pending" | "Ongoing" | "Completed";
  pickup: string;
  drop: string;
  createdAt: string;
}

export default function ManagerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (error) {
      localStorage.removeItem("token");
      router.push("/");
    }

    fetchTrips();
  }, [router]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await getTrips(); 
      setTrips(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) return <div>Loading...</div>;

  
  const totalTrips = trips.length;
  const ongoingTrips = trips.filter(t => t.status === "Ongoing").length;
  const pendingTrips = trips.filter(t => t.status === "Pending").length;
  const completedTrips = trips.filter(t => t.status === "Completed").length;

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      
      <Navbar />

      
      <div className="flex flex-1">
        <Sidebar />

        
        <main className="p-8 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Total Trips
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {totalTrips}
              </p>
              <p className="text-gray-600">All trips</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Ongoing Trips
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {ongoingTrips}
              </p>
              <p className="text-gray-600">Currently active</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Pending Trips
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingTrips}
              </p>
              <p className="text-gray-600">Awaiting start</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Completed Trips
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {completedTrips}
              </p>
              <p className="text-gray-600">Finished</p>
            </div>
          </div>

          
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Trip ID</th>
                  <th className="p-3 text-left">Driver</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Pickup</th>
                  <th className="p-3 text-left">Drop</th>
                  <th className="p-3 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {trips.map(trip => (
                  <tr
                    key={trip.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      #{trip.id}
                    </td>
                    <td className="p-3">
                      {trip.driverName}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          trip.status === "Ongoing"
                            ? "bg-blue-100 text-blue-700"
                            : trip.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </td>
                    <td className="p-3">{trip.pickup}</td>
                    <td className="p-3">{trip.drop}</td>
                    <td className="p-3 text-gray-500">
                      {new Date(trip.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}

                {trips.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-6 text-center text-gray-500"
                    >
                      No trips found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
