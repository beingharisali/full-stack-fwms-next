"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import VehicleChart from "../component/charts/vehicleChart";
import DriversChart from "../component/charts/driversChart";

import { getDrivers } from "../../services/driver.api";
import { getVehicles } from "../../services/vehicle.api";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleChartData, setVehicleChartData] = useState<any[]>([]);
  const [driversChartData, setDriversChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= AUTH ================= */
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

  /* ================= FETCH DATA ================= */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [driversRes, vehiclesRes] = await Promise.all([
        getDrivers(),
        getVehicles(),
      ]);

      setDrivers(driversRes.drivers || []);
      setVehicles(vehiclesRes || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= VEHICLES CHART ================= */
  useEffect(() => {
    if (vehicles.length > 0) {
      const available = vehicles.filter(
        v => v.status?.toLowerCase() === "available"
      ).length;

      const unavailable = vehicles.filter(
        v => v.status?.toLowerCase() === "unavailable"
      ).length;

      const maintenance = vehicles.filter(
        v => v.status?.toLowerCase() === "maintenance"
      ).length;

      setVehicleChartData([
        { name: "Available", value: available },
        { name: "Unavailable", value: unavailable },
        { name: "Maintenance", value: maintenance },
      ]);
    }
  }, [vehicles]);

  /* ================= DRIVERS CHART (FINAL FIX) ================= */
  useEffect(() => {
    if (drivers.length > 0) {
      const availableDrivers = drivers.filter(
        d => d.available === true
      ).length;

      const unavailableDrivers = drivers.filter(
        d => d.available === false
      ).length;

      setDriversChartData([
        { name: "Available", value: availableDrivers },
        { name: "Unavailable", value: unavailableDrivers },
      ]);
    }
  }, [drivers]);

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
          {/* STATS */}
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
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                Vehicles Overview
              </h3>
              <VehicleChart data={vehicleChartData} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                Drivers Overview
              </h3>
              <DriversChart data={driversChartData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
