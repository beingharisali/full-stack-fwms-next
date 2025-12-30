"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

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

    // Load mock data from localStorage or empty arrays
    const storedUsers = localStorage.getItem("users");
    const storedVehicles = localStorage.getItem("vehicles");
    const storedTasks = localStorage.getItem("tasks");

    setUsers(storedUsers ? JSON.parse(storedUsers) : []);
    setVehicles(storedVehicles ? JSON.parse(storedVehicles) : []);
    setTasks(storedTasks ? JSON.parse(storedTasks) : []);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!user) return <div>Loading...</div>;

  // Example percentages
  const usersPercentage = users.length > 0 ? Math.min(users.length * 10, 100) : 0;
  const vehiclesPercentage = vehicles.length > 0 ? Math.min(vehicles.length * 15, 100) : 0;
  const tasksPercentage = tasks.length > 0 ? Math.min(tasks.length * 20, 100) : 0;
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
            {/* Card 1: Users */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-gray-600">{usersPercentage}% increase</p>
            </div>

            {/* Card 2: Vehicles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Total Vehicles</h3>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
              <p className="text-gray-600">{vehiclesPercentage}% increase</p>
            </div>

            {/* Card 3: Tasks */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Total Tasks</h3>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              <p className="text-gray-600">{tasksPercentage}% completed</p>
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
