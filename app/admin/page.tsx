"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";

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

  /* ================= AUTH CHECK ================= */
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
  }, [router]);

  /* ================= FETCH DASHBOARD DATA ================= */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [driversData, vehiclesData, tripsData] = await Promise.all([
        getDrivers(),
        getVehicles(),
        getTrips(),
      ]);

      setDrivers(driversData?.drivers || driversData || []);
      setVehicles(vehiclesData || []);
      setTrips(tripsData || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= VEHICLE CHART ================= */
  useEffect(() => {
    if (!vehicles.length) {
      setVehicleChartData([]);
      return;
    }

    setVehicleChartData([
      {
        name: "Available",
        value: vehicles.filter(v => v.status?.toLowerCase() === "available").length,
      },
      {
        name: "Unavailable",
        value: vehicles.filter(v => v.status?.toLowerCase() === "unavailable").length,
      },
      {
        name: "Maintenance",
        value: vehicles.filter(v => v.status?.toLowerCase() === "maintenance").length,
      },
    ]);
  }, [vehicles]);

  /* ================= DRIVERS CHART ================= */
  useEffect(() => {
    if (!drivers.length) {
      setDriversChartData([]);
      return;
    }

    setDriversChartData([
      {
        name: "Active",
        value: drivers.filter(d => d.available === true).length,
      },
      {
        name: "Inactive",
        value: drivers.filter(d => d.available === false && !d.assignedVehicle).length,
      },
      {
        name: "On Trip",
        value: drivers.filter(d => d.assignedVehicle && d.available === false).length,
      },
    ]);
  }, [drivers]);

  /* ================= TRIPS CHART (FINAL FIX) ================= */
  useEffect(() => {
    if (!trips || trips.length === 0) {
      setTripsChartData([]);
      return;
    }

    const normalize = (s?: string) =>
      s?.toLowerCase().replace(/\s+/g, "_");

    const assigned = trips.filter(t => normalize(t.status) === "assigned").length;
    const inProgress = trips.filter(
      t =>
        normalize(t.status) === "in_progress" ||
        normalize(t.status) === "ongoing"
    ).length;
    const completed = trips.filter(t => normalize(t.status) === "completed").length;

    const total = assigned + inProgress + completed;

    if (total === 0) {
      setTripsChartData([]);
      return;
    }

    setTripsChartData([
      { name: "Assigned", value: assigned || 0.0001 },
      { name: "In Progress", value: inProgress || 0.0001 },
      { name: "Completed", value: completed || 0.0001 },
    ]);
  }, [trips]);

  if (!user || loading) {
    return <div className="p-10">Loading...</div>;
  }

  const availableVehicles = vehicles.filter(
    v => v.status?.toLowerCase() === "available"
  ).length;

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="p-8 flex-1">
          {/* ===== STATS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold">Total Drivers</h3>
              <p className="text-2xl font-bold">{drivers.length}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold">Total Vehicles</h3>
              <p className="text-2xl font-bold">{vehicles.length}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold">Available Vehicles</h3>
              <p className="text-2xl font-bold">{availableVehicles}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold">Total Trips</h3>
              <p className="text-2xl font-bold">{trips.length}</p>
            </div>
          </div>

          {/* ===== CHARTS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Vehicles Overview</h3>
              <VehicleChart data={vehicleChartData} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Drivers Overview</h3>
              <DriversChart data={driversChartData} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Trips Overview</h3>

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
