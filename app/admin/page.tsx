"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-2xl font-bold">25</p>
            <p className="text-green-500">+12% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Vehicles</h3>
            <p className="text-2xl font-bold">15</p>
            <p className="text-green-500">+8% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Active Trips</h3>
            <p className="text-2xl font-bold">8</p>
            <p className="text-blue-500">Currently running</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">System Usage</h3>
            <p className="text-2xl font-bold">85%</p>
            <p className="text-orange-500">High usage</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}