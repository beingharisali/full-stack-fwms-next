"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./component/navbar";
import LoadingBar from "../component/LoadingBar";
import { getTrips } from "@/services/trip.api";
import { getDrivers } from "@/services/driver.api";
import { Trip } from "@/types/trip";

const ITEMS_PER_PAGE = 5;

type ViewType = "none" | "trips" | "drivers";

export default function ManagerPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<ViewType>("trips");

  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [loadingTrips, setLoadingTrips] = useState(false);

  const [tripSort, setTripSort] = useState<"none" | "time" | "name">("none");
  const [driverSort, setDriverSort] = useState<"none" | "name">("none");
  const [driverLicenseFilter, setDriverLicenseFilter] = useState("all");

  const [tripPage, setTripPage] = useState(1);
  const [driverPage, setDriverPage] = useState(1);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      setUser(JSON.parse(atob(token.split(".")[1])));
    } catch {
      localStorage.removeItem("token");
      router.push("/");
      return;
    }

    const init = async () => {
      setPageLoading(true);
      await Promise.all([fetchTrips(), fetchDrivers()]);
      setPageLoading(false);
    };

    init();
  }, []);

  
  const fetchTrips = async () => {
    try {
      setLoadingTrips(true);
      const res = await getTrips();
      setTrips(Array.isArray(res) ? res : []);
    } finally {
      setLoadingTrips(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res: any = await getDrivers();
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.drivers)
        ? res.drivers
        : [];
      setDrivers(list);
    } catch {
      setDrivers([]);
    }
  };

 
  const handleView = (type: ViewType) => {
    setView(type);
    setTripPage(1);
    setDriverPage(1);
  };

 
  const sortedTrips = useMemo(() => {
    if (tripSort === "time") {
      return [...trips].sort((a, b) =>
        (a.departureTime || "").localeCompare(b.departureTime || "")
      );
    }
    if (tripSort === "name") {
      return [...trips].sort((a, b) =>
        a.destination.localeCompare(b.destination)
      );
    }
    return trips;
  }, [trips, tripSort]);

  const paginatedTrips = useMemo(() => {
    const start = (tripPage - 1) * ITEMS_PER_PAGE;
    return sortedTrips.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedTrips, tripPage]);

  const totalTripPages = Math.ceil(sortedTrips.length / ITEMS_PER_PAGE);

  
  const filteredDrivers = useMemo(() => {
    let list = [...drivers];

    if (driverLicenseFilter !== "all") {
      list = list.filter(d => d.licenseType === driverLicenseFilter);
    }

    if (driverSort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [drivers, driverLicenseFilter, driverSort]);

  const paginatedDrivers = useMemo(() => {
    const start = (driverPage - 1) * ITEMS_PER_PAGE;
    return filteredDrivers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDrivers, driverPage]);

  const totalDriverPages = Math.ceil(
    filteredDrivers.length / ITEMS_PER_PAGE
  );


  if (pageLoading) {
    return <LoadingBar title="Loading Manager Dashboard" duration={2} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar setView={handleView} currentView={view} />

      <main className="p-8 space-y-10">
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold">Total Trips</h3>
            <p className="text-3xl">{trips.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold">Total Drivers</h3>
            <p className="text-3xl">{drivers.length}</p>
          </div>
        </div>

       
        {view === "trips" && (
          <div className="bg-white rounded-xl shadow">
            <div className="bg-slate-900 text-white px-6 py-4 rounded-t-xl flex justify-between">
              <h2 className="text-lg font-semibold">Trips</h2>
              <select
                value={tripSort}
                onChange={e => setTripSort(e.target.value as any)}
                className="bg-white text-black px-3 py-1 rounded"
              >
                <option value="none">Normal</option>
                <option value="time">Early Departure</option>
                <option value="name">Destination (A-Z)</option>
              </select>
            </div>

            <table className="w-full">
              <thead className="bg-slate-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Departure</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Destination</th>
                  <th className="px-4 py-3 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrips.map(trip => (
                  <tr key={trip._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-3">{trip.departure}</td>
                    <td className="px-4 py-3">
                      {new Date(trip.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{trip.destination}</td>
                    <td className="px-4 py-3">
                      {trip.departureTime || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            
            <div className="flex justify-center gap-4 py-4">
              <button
                disabled={tripPage === 1}
                onClick={() => setTripPage(p => p - 1)}
                className="px-4 py-1 bg-slate-900 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {tripPage} of {totalTripPages}
              </span>
              <button
                disabled={tripPage === totalTripPages}
                onClick={() => setTripPage(p => p + 1)}
                className="px-4 py-1 bg-slate-900 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        
        {view === "drivers" && (
          <div className="bg-white rounded-xl shadow">
            <div className="bg-slate-900 text-white px-6 py-4 rounded-t-xl flex justify-between">
              <h2 className="text-lg font-semibold">Drivers</h2>

              <div className="flex gap-3">
                <select
                  value={driverLicenseFilter}
                  onChange={e => {
                    setDriverLicenseFilter(e.target.value);
                    setDriverPage(1);
                  }}
                  className="bg-white text-black px-3 py-1 rounded"
                >
                  <option value="all">All License</option>
                  <option value="LTV">LTV</option>
                  <option value="HTV">HTV</option>
                  <option value="MCV">MCV</option>
                </select>

                <select
                  value={driverSort}
                  onChange={e => {
                    setDriverSort(e.target.value as any);
                    setDriverPage(1);
                  }}
                  className="bg-white text-black px-3 py-1 rounded"
                >
                  <option value="none">Normal</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>

            <table className="w-full">
              <thead className="bg-slate-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">License No</th>
                  <th className="px-4 py-3 text-left">License Type</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDrivers.map(driver => (
                  <tr key={driver._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-3">{driver.name}</td>
                    <td className="px-4 py-3">
                      {driver.licenseNumber}
                    </td>
                    <td className="px-4 py-3">
                      {driver.licenseType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

           
            <div className="flex justify-center gap-4 py-4">
              <button
                disabled={driverPage === 1}
                onClick={() => setDriverPage(p => p - 1)}
                className="px-4 py-1 bg-slate-900 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {driverPage} of {totalDriverPages}
              </span>
              <button
                disabled={driverPage === totalDriverPages}
                onClick={() => setDriverPage(p => p + 1)}
                className="px-4 py-1 bg-slate-900 text-white rounded disabled:opacity-50"
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
