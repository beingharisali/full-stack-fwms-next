"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

import DriverNavbar from "../driver/component/navbar";
import { getTrips } from "@/services/trip.api";
import LoadingBar from "../../component/LoadingBar";
import { Trip } from "@/types/trip";

const ITEMS_PER_PAGE = 5;

export default function DriverPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [view, setView] = useState<"none" | "trips">("trips");
  const [tripPage, setTripPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "driver") return router.push("/");

    try {
      setUser(JSON.parse(atob(token.split(".")[1])));
    } catch {
      localStorage.removeItem("token");
      return router.push("/");
    }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const init = async () => {
      setPageLoading(true);
      await Promise.all([fetchTrips(), delay(1000)]);
      setPageLoading(false);
    };
    init();
  }, [router]);

  const fetchTrips = async () => {
    try {
      setLoadingTrips(true);
      const data = await getTrips();
      console.log("data", data);
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTrips([]);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleView = async (type: "trips") => {
    if (type === "trips" && trips.length === 0) await fetchTrips();
    setView(type);
  };

  const paginatedTrips = useMemo(() => {
    const start = (tripPage - 1) * ITEMS_PER_PAGE;
    return trips.slice(start, start + ITEMS_PER_PAGE);
  }, [trips, tripPage]);

  const totalTrips = trips.length;
  const ongoingTrips = trips.filter(t => t.status === "Ongoing").length;
  const completedTrips = trips.filter(t => t.status === "Completed").length;

  if (pageLoading) {
    return <LoadingBar title="Loading Driver Dashboard" duration={2} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <DriverNavbar setView={handleView} currentView={view} />

      <main className="p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-black">Total Trips</h3>
            <p className="text-3xl font-medium">{totalTrips}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-black">Ongoing Trips</h3>
            <p className="text-3xl font-medium text-blue-600">
              {ongoingTrips}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-black">Completed Trips</h3>
            <p className="text-3xl font-medium text-green-600">
              {completedTrips}
            </p>
          </div>
        </div>

        {view === "trips" && (
          <div className="bg-white rounded-xl shadow">
            <div className="bg-slate-900 text-white px-6 py-4 rounded-t-xl flex justify-between">
              <h2 className="text-lg font-semibold">Assigned Trips</h2>
            </div>

            <table className="w-full">
              <thead className="bg-slate-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Trip ID</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created</th>
                </tr>
              </thead>

              <tbody>
                {loadingTrips ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-gray-600">
                      Loading trips...
                    </td>
                  </tr>
                ) : paginatedTrips.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-gray-600">
                      No trips assigned by admin
                    </td>
                  </tr>
                ) : (
                  paginatedTrips.map(trip => (
                    <tr
                      key={trip._id}
                      className="border-b hover:bg-gray-100"
                    >
                      <td className="px-4 py-3">#{trip._id}</td>
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3">
                        {new Date(trip.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="flex justify-between items-center p-4">
              <button
                disabled={tripPage === 1}
                onClick={() => setTripPage(p => p - 1)}
                className="px-4 py-2 bg-slate-900 text-white rounded disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm">
                Page {tripPage} of{" "}
                {Math.ceil(trips.length / ITEMS_PER_PAGE)}
              </span>

              <button
                disabled={tripPage * ITEMS_PER_PAGE >= trips.length}
                onClick={() => setTripPage(p => p + 1)}
                className="px-4 py-2 bg-slate-900 text-white rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
