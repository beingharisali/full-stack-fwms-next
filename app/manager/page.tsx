"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../manager/component/navbar";
import { getTrips } from "@/services/trip.api";
import { Trip } from "@/types/trip";

export default function ManagerPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<"none" | "trips" | "drivers">("none");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      localStorage.removeItem("token");
      router.push("/");
      return;
    }

    
    setDrivers([
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
      { id: 3, name: "Ali Khan" },
    ]);

    fetchTripsSummary();
  }, [router]);

  const fetchTripsSummary = async () => {
    try {
      setLoadingTrips(true);
      const data = await getTrips();
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTrips(false);
    }
  };

  
  const handleView = (type: "trips" | "drivers") => {
    if (type === "trips" && trips.length === 0) {
      fetchTripsSummary();
    }
    setView(type);
  };

  if (!user) {
    return <div className="p-10 text-gray-700">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <Navbar setView={handleView} currentView={view} />

      <main className="p-8 flex-1">
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Total Trips
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {trips.length}
            </p>
            <p className="text-gray-600">All trips in system</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Total Drivers
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {drivers.length}
            </p>
            <p className="text-gray-600">Drivers added by admin</p>
          </div>
        </div>

      
        {view === "trips" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <h2 className="text-xl font-bold p-6 border-b text-gray-900">
              Trips
            </h2>

            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3">Departure</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Departure Time</th>
                  <th className="px-4 py-3">Arrival Time</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loadingTrips ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-600">
                      Loading trips...
                    </td>
                  </tr>
                ) : trips.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-600">
                      No trips available
                    </td>
                  </tr>
                ) : (
                  trips.map(trip => (
                    <tr key={trip._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{trip.departure}</td>
                      <td className="px-4 py-3">
                        {new Date(trip.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{trip.destination}</td>
                      <td className="px-4 py-3">
                        {trip.departureTime || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {trip.arrivalTime || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            router.push(`/trip/update/${trip._id}`)
                          }
                          className="bg-blue-500 text-grey px-3 py-1 rounded text-sm hover:bg-blue-400"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        
        {view === "drivers" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Drivers
            </h2>

            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                </tr>
              </thead>
              <tbody>
                {drivers.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-6 text-center text-gray-600">
                      No drivers found
                    </td>
                  </tr>
                ) : (
                  drivers.map(driver => (
                    <tr key={driver.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{driver.id}</td>
                      <td className="px-4 py-3">{driver.name}</td>
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
