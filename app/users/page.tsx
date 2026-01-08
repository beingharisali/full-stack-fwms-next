"use client";

import { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { getAllUsers, deleteUser } from "../../services/auth.api";

type User = {
  _id: string; // MongoDB ID
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "manager" | "driver";
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchName, setSearchName] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found. Please login.");
      setLoading(false);
      return;
    }
    fetchUsers(token);
  }, []);

  const fetchUsers = async (token: string) => {
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Token not found. Please login again.");

      await deleteUser(_id, token);
      setUsers((prev) => prev.filter((user) => user._id !== _id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user. Check backend route.");
    }
  };

  // Filter by role first
  let filteredUsers =
    filterRole === "all" ? users : users.filter((u) => u.role === filterRole);

  // Apply name search (firstName + lastName)
  if (searchName.trim() !== "") {
    filteredUsers = filteredUsers.filter((u) =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(searchName.toLowerCase())
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 flex-1">
          <h1 className="text-2xl font-bold mb-6">Admin Panel – Users</h1>

          {loading && <p>Loading users...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && users.length > 0 && (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-4">
                {/* Role Filter */}
                <div>
                  <label className="mr-2 font-semibold">Filter by Role:</label>
                  <select
                    className="border px-2 py-1 rounded"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="driver">Driver</option>
                  </select>
                </div>

                {/* Name Search */}
                <div>
                  <label className="mr-2 font-semibold">Search by Name:</label>
                  <input
                    type="text"
                    placeholder="Enter name..."
                    className="border px-2 py-1 rounded"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b border-gray-200">
                          <td className="px-4 py-3">{`${user.firstName} ${user.lastName}`}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3 capitalize">{user.role}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-center">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!loading && !error && users.length === 0 && <p>No users found.</p>}
        </main>
      </div>
    </div>
  );
}
