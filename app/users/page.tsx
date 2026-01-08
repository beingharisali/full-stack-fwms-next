"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";
import { getAllUsers } from "../../services/auth.api";

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "driver";
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token not found. Please login.");
      setLoading(false);
      return;
    }

    getAllUsers(token)
      .then((data) => setUsers(data)) // ✅ data is array
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Admin Panel – Users</h1>

          {loading && <p>Loading users...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && users.length > 0 && (
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border p-2">{user.id}</td>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2 capitalize">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && !error && users.length === 0 && (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

console.log();