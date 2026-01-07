"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { getDrivers } from "../../services/driver.api";
import { getVehicles } from "../../services/vehicle.api";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
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

    // Fetch real data from APIs
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [driversData, vehiclesData] = await Promise.all([
        getDrivers(),
        getVehicles()
      ]);
      setDrivers(driversData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!user) return <div>Loading...</div>;

  // Example percentages
  const driversPercentage = drivers.length > 0 ? Math.min(drivers.length * 10, 100) : 0;
  const vehiclesPercentage = vehicles.length > 0 ? Math.min(vehicles.length * 15, 100) : 0;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const systemUsagePercentage = Math.floor(Math.random() * 100); // mock system usage

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col ">
      {/* Navbar */}
      <Navbar/>

      {/* Main content */}
      <div className="flex flex-1">
        <Sidebar/>

        {/* Dashboard cards */}
        <main className="p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Drivers */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Total Drivers</h3>
              <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
              <p className="text-gray-600">{driversPercentage}% increase</p>
            </div>

            {/* Card 2: Vehicles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Total Vehicles</h3>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
              <p className="text-gray-600">{vehiclesPercentage}% increase</p>
            </div>

            {/* Card 3: Available Vehicles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Available Vehicles</h3>
              <p className="text-2xl font-bold text-gray-900">{availableVehicles}</p>
              <p className="text-gray-600">Ready for use</p>
            </div>

            {/* Card 4: System Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">System Usage</h3>
              <p className="text-2xl font-bold text-gray-900">{systemUsagePercentage}%</p>
              <p className="text-gray-600">Current usage</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
