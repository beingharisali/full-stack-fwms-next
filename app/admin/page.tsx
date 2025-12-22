"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav className="flex flex-col space-y-2">
          <a href="#dashboard" className="px-4 py-2 rounded hover:bg-gray-200">Dashboard</a>
          <a href="#users" className="px-4 py-2 rounded hover:bg-gray-200">Users</a>
          <a href="#vehicles" className="px-4 py-2 rounded hover:bg-gray-200">Vehicles</a>
          <a href="#tasks" className="px-4 py-2 rounded hover:bg-gray-200">Tasks</a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow flex justify-between items-center px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.firstName} {user.lastName} | Role: {user.role}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard cards */}
        <main className="p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Users */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-green-500">{usersPercentage}% increase</p>
            </div>

            {/* Card 2: Vehicles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Total Vehicles</h3>
              <p className="text-2xl font-bold">{vehicles.length}</p>
              <p className="text-green-500">{vehiclesPercentage}% increase</p>
            </div>

            {/* Card 3: Tasks */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
              <p className="text-2xl font-bold">{tasks.length}</p>
              <p className="text-green-500">{tasksPercentage}% completed</p>
            </div>

            {/* Card 4: System Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">System Usage</h3>
              <p className="text-2xl font-bold">{systemUsagePercentage}%</p>
              <p className="text-blue-500">Current usage</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
