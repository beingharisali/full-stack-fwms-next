"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";
import { Vehicle } from "../../types/vehicle";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../services/vehicle.api";
import LoadingBar from "../component/LoadingBar";

const ITEMS_PER_PAGE = 5;

function VehiclePage() {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "" | "Car" | "Bike" | "Truck" | "Van"
  >("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getVehicles();
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch vehicles");
      console.error(err);
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
    } catch (err) {
      setError("Failed to save vehicle");
      console.error(err);
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
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;
    try {
      await deleteVehicle(id);
      await fetchVehicles();
    } catch (err) {
      setError("Failed to delete vehicle");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      number: "",
      type: "Car",
      status: "Available",
    });
    setEditingVehicle(null);
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "In-Use":
        return "bg-blue-100 text-blue-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? v.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <LoadingBar title="Loading Vehicles" duration={2} />;

  return (
    <div className="flex min-h-screen bg-white flex-col text-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Vehicle Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              {showForm ? "Cancel" : "Add Vehicle"}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      number: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                  placeholder="ABC-123"
                  required
                />

                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                </select>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
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

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Number</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVehicles.map((v) => (
                  <tr key={v._id} className="border-t">
                    <td className="p-3">{v.number}</td>
                    <td className="p-3">{v.type}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusColor(
                          v.status
                        )}`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
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

            {/* 🔹 UPDATED PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 border rounded ${
                          currentPage === page
                            ? "bg-black text-white"
                            : ""
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
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

export default VehiclePage;
