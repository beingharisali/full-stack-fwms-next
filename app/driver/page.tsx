"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function DriverPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "driver"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Driver Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Today's Trips</h3>
            <p className="text-2xl font-bold">3</p>
            <p className="text-blue-500">Assigned to you</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Vehicle Status</h3>
            <p className="text-2xl font-bold">Available</p>
            <p className="text-green-500">Ready for next trip</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}