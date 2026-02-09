"use client";

import { useEffect, useState } from "react";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import LoadingBar from "../component/LoadingBar";
import { Vehicle } from "../../types/vehicle";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../services/vehicle.api";

const ITEMS_PER_PAGE = 5;

const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  delta = 2
) => {
  const range: (number | string)[] = [];
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  range.push(1);

  if (left > 2) range.push("...");

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < totalPages - 1) range.push("...");

  if (totalPages > 1) range.push(totalPages);

  return range;
};

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState({
    number: "",
    type: "Car" as "Car" | "Bike" | "Truck" | "Van",
    status: "Available" as
      | "Available"
      | "In-Use"
      | "Maintenance"
      | "Inactive",   
  });

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch {
      setError("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle._id!, formData);
      } else {
        await createVehicle(formData);
      }
      await fetchVehicles();
      resetForm();
    } catch {
      setError("Failed to save vehicle");
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      number: vehicle.number,
      type: vehicle.type,
      status: vehicle.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await deleteVehicle(id);
    setVehicles((prev) => prev.filter((v) => v._id !== id));
  };

  const resetForm = () => {
    setFormData({ number: "", type: "Car", status: "Available" });
    setEditingVehicle(null);
    setShowForm(false);
  };

  let filteredVehicles = vehicles;

  if (filterType !== "all") {
    filteredVehicles = filteredVehicles.filter((v) => v.type === filterType);
  }

  if (filterStatus !== "all") {
    filteredVehicles = filteredVehicles.filter((v) => v.status === filterStatus);
  }

  if (search) {
    filteredVehicles = filteredVehicles.filter((v) =>
      v.number.toLowerCase().includes(search.toLowerCase())
    );
  }

  filteredVehicles.sort((a, b) =>
    sortOrder === "asc" ? a.number.localeCompare(b.number) : b.number.localeCompare(a.number)
  );

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const statusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";
      case "In-Use":
        return "bg-blue-100 text-blue-700";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  if (loading) return <LoadingBar title="Loading Vehicles" duration={2} />;

  return (
    <div className="flex min-h-screen bg-white text-black flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Vehicles</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              {showForm ? "Cancel" : "Add Vehicle"}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-4 mb-4 flex-wrap">
            <input
              placeholder="Search vehicle number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 border px-3 py-2 rounded"
            />

            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded"
            >
              <option value="all">All Types</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded"
            >
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="In-Use">In-Use</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
              className="border px-4 py-2 rounded bg-black text-white"
            >
              {sortOrder === "asc" ? "A → Z" : "Z → A"}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded shadow p-6 mb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value.toUpperCase() })
                  }
                  placeholder="ABC-123"
                  required
                  className="w-full border px-3 py-2 rounded"
                />

                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                </select>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="Available">Available</option>
                  <option value="In-Use">In-Use</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <button className="bg-black text-white px-4 py-2 rounded">
                  {editingVehicle ? "Update" : "Create"}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white  shadow overflow-x-auto">
            <table className="w-full border border-black">
              <thead className="bg-gray-200 border border-black">
                <tr>
                  <th className="px-4 py-3 border">Number</th>
                  <th className="px-4 py-3 border">Type</th>
                  <th className="px-4 py-3 border">Status</th>
                  <th className="px-4 py-3 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedVehicles.map((v) => (
                  <tr key={v._id} className="border">
                    <td className="px-4 py-3">{v.number}</td>
                    <td className="px-4 py-3">{v.type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${statusColor(v.status)}`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(v)}
                        className="bg-black text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v._id!)}
                        className="bg-gray-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No vehicles found.
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-4 sm:justify-between">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <div className="flex flex-wrap gap-1 justify-center">
                  {getPaginationRange(currentPage, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={i} className="px-2 py-1 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        className={`px-3 py-1 border rounded text-sm ${
                          p === currentPage ? "bg-black text-white" : ""
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
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
