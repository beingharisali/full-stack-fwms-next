"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function ManagerPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">My Team</h3>
            <p className="text-2xl font-bold">12</p>
            <p className="text-blue-500">Active drivers</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Scheduled Trips</h3>
            <p className="text-2xl font-bold">6</p>
            <p className="text-green-500">Today</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Available Vehicles</h3>
            <p className="text-2xl font-bold">9</p>
            <p className="text-orange-500">Ready for dispatch</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}