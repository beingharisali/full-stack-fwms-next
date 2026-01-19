"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import LoadingBar from "../component/LoadingBar";

import VehicleChart from "../component/charts/vehicleChart";
import DriversChart from "../component/charts/driversChart";
import TripsChart from "../component/charts/tripsChart";

import { getDrivers } from "../../services/driver.api";
import { getVehicles } from "../../services/vehicle.api";
import { getTrips } from "../../services/trip.api";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);

  const [vehicleChartData, setVehicleChartData] = useState<any[]>([]);
  const [driversChartData, setDriversChartData] = useState<any[]>([]);
  const [tripsChartData, setTripsChartData] = useState<any[]>([]);

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
    } catch {
      localStorage.removeItem("token");
      router.push("/");
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [driversRes, vehiclesRes, tripsRes] = await Promise.all([
        getDrivers(),
        getVehicles(),
        getTrips(),
      ]);

      setDrivers(driversRes?.drivers || driversRes || []);
      setVehicles(vehiclesRes || []);
      setTrips(tripsRes || []);

      setTimeout(() => setLoading(false), 600);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!vehicles.length) return;

    setVehicleChartData([
      { name: "Available", value: vehicles.filter(v => v.status === "available").length },
      { name: "Unavailable", value: vehicles.filter(v => v.status === "unavailable").length },
      { name: "Maintenance", value: vehicles.filter(v => v.status === "maintenance").length },
    ]);
  }, [vehicles]);

  useEffect(() => {
    if (!drivers.length) return;

    setDriversChartData([
      { name: "Active", value: drivers.filter(d => d.available).length },
      { name: "Inactive", value: drivers.filter(d => !d.available && !d.assignedVehicle).length },
      { name: "On Trip", value: drivers.filter(d => d.assignedVehicle).length },
    ]);
  }, [drivers]);

  useEffect(() => {
    if (!trips.length) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let upcoming = 0;
    let todayTrips = 0;
    let past = 0;

    trips.forEach(trip => {
      const d = new Date(trip.date);
      d.setHours(0, 0, 0, 0);

      if (d.getTime() === today.getTime()) todayTrips++;
      else if (d > today) upcoming++;
      else past++;
    });

    setTripsChartData([
      { name: "Upcoming Trips", value: upcoming },
      { name: "Today Trips", value: todayTrips },
      { name: "Past Trips", value: past },
    ]);
  }, [trips]);

  if (!user || loading) {
    return <LoadingBar title="Loading Admin Dashboard" duration={1} />;
  }

  const availableVehicles = vehicles.filter(
    v => v.status?.toLowerCase() === "available"
  ).length;

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="p-8 flex-1">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">Total Drivers</h3>
              <p className="text-2xl font-bold">{drivers.length}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">Total Vehicles</h3>
              <p className="text-2xl font-bold">{vehicles.length}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">Available Vehicles</h3>
              <p className="text-2xl font-bold">{availableVehicles}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">Total Trips</h3>
              <p className="text-2xl font-bold">{trips.length}</p>
            </div>
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white rounded-lg shadow-md p-6 transition hover:bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">
                Vehicles Overview
              </h3>
              <VehicleChart data={vehicleChartData} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 transition hover:bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">
                Drivers Overview
              </h3>
              <DriversChart data={driversChartData} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 transition hover:bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">
                Trips Overview
              </h3>

              {tripsChartData.length > 0 ? (
                <TripsChart data={tripsChartData} />
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No trip data available
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
