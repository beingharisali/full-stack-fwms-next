"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import VehicleChart from "../component/charts/vehicleChart";

import { getDrivers } from "../../services/driver.api";
import { getVehicles } from "../../services/vehicle.api";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleChartData, setVehicleChartData] = useState<any[]>([]);
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
      return;
    }

    fetchDashboardData();
  }, [router]);

  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [driversData, vehiclesData] = await Promise.all([
        getDrivers(),
        getVehicles(),
      ]);

      setDrivers(Array.isArray(driversData) ? driversData : (driversData as any)?.data || []);
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : (vehiclesData as any)?.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    if (vehicles.length > 0) {
      const available = vehicles.filter(
        (v) => v.status === "Available"
      ).length;

      const unavailable = vehicles.filter(
        (v) => v.status === "Unavailable"
      ).length;

      const maintenance = vehicles.filter(
        (v) => v.status === "Maintenance"
      ).length;

      setVehicleChartData([
        { name: "Available", value: available },
        { name: "Unavailable", value: unavailable },
        { name: "Maintenance", value: maintenance },
      ]);
    }
  }, [vehicles]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!user || loading) {
    return <div className="p-10">Loading...</div>;
  }

  
  const driversPercentage =
    drivers.length > 0 ? Math.min(drivers.length * 10, 100) : 0;

  const vehiclesPercentage =
    vehicles.length > 0 ? Math.min(vehicles.length * 15, 100) : 0;

  const availableVehicles = vehicles.filter(
    (v) => v.status === "Available"
  ).length;

  const systemUsagePercentage = Math.floor(Math.random() * 100);

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      
      <Navbar />

      
      <div className="flex flex-1">
        <Sidebar />

        <main className="p-8 flex-1">
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Total Drivers
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {drivers.length}
              </p>
              <p className="text-gray-600">
                {driversPercentage}% increase
              </p>
            </div>

           
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Total Vehicles
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.length}
              </p>
              <p className="text-gray-600">
                {vehiclesPercentage}% increase
              </p>
            </div>

           
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Available Vehicles
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {availableVehicles}
              </p>
              <p className="text-gray-600">Ready for use</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                System Usage
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {systemUsagePercentage}%
              </p>
              <p className="text-gray-600">Current usage</p>
            </div>
          </div>

          <div className="mt-10 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Vehicles Overview
            </h3>

            <div className="flex justify-center">
              <VehicleChart data={vehicleChartData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
