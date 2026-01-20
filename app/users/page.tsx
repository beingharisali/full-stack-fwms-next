"use client";

import { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import { getAllUsers, deleteUser } from "../../services/auth.api";

type User = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "manager" | "driver";
};

const ITEMS_PER_PAGE = 5;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found");
      setLoading(false);
      return;
    }
    fetchUsers(token);
  }, []);

  const fetchUsers = async (token: string) => {
    try {
      const data = await getAllUsers(token);
      setUsers(data.users);
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    await deleteUser(id, token);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  let filteredUsers =
    filterRole === "all" ? users : users.filter((u) => u.role === filterRole);

  if (searchName) {
    filteredUsers = filteredUsers.filter((u) =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(searchName.toLowerCase())
    );
  }

  filteredUsers.sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading)
    return (
      <div className="flex min-h-screen bg-white text-black flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-8 text-center">Loading...</div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-white text-black flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Users</h1>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <input
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 border px-3 py-2 rounded"
            />

            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="driver">Driver</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="border px-4 py-2 rounded bg-black text-white"
            >
              {sortOrder === "asc" ? "A → Z" : "Z → A"}
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full border border-black">
              <thead className="bg-gray-200 border border-black">
                <tr>
                  <th className="px-4 py-3 border border-black text-left">
                    Name
                  </th>
                  <th className="px-4 py-3 border border-black text-left">
                    Email
                  </th>
                  <th className="px-4 py-3 border border-black text-left">
                    Role
                  </th>
                  <th className="px-4 py-3 border border-black text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr key={u._id} className="border border-black">
                    <td className="px-4 py-3">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => u._id && handleDelete(u._id)}
                        className="bg-gray-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No users found.
              </div>
            )}

            {/* 🔹 UPDATED PAGINATION (Prev + Numbers + Next) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1 border rounded ${
                          p === currentPage
                            ? "bg-black text-white"
                            : ""
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
