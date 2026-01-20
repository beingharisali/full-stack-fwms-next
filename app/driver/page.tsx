"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import LoadingBar from "../component/LoadingBar";
import { getDrivers, deleteDriver } from "../../services/driver.api";
import { Driver } from "@/types/driver";

const ITEMS_PER_PAGE = 5;

export default function DriversPage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* 🔍 FILTERS */
  const [search, setSearch] = useState("");
  const [licenseType, setLicenseType] = useState("all");

  /* 📄 PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await getDrivers();
      setDrivers(res.drivers || []);
    } catch {
      setError("Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    await deleteDriver(id);
    setDrivers((prev) => prev.filter((d) => d._id !== id));
  };

  /* 🔍 FILTERING */
  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());

    const matchesLicense =
      licenseType === "all" ? true : d.licenseType === licenseType;

    return matchesSearch && matchesLicense;
  });

  /* 📄 PAGINATION */
  const totalPages = Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE);

  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const licenseTypes = Array.from(new Set(drivers.map((d) => d.licenseType)));

  if (loading) return <LoadingBar title="Loading Drivers" duration={2} />;

  return (
    <div className="flex min-h-screen bg-white text-black flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-8">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Drivers</h1>
            <button
              onClick={() => router.push("/driver/create")}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Create Driver
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* FILTER BAR */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              placeholder="Search by name or license number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 border px-3 py-2 rounded"
            />
            <select
              value={licenseType}
              onChange={(e) => {
                setLicenseType(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded"
            >
              <option value="all">All License Types</option>
              {licenseTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full border border-black">
              <thead className="bg-gray-200 border border-black">
                <tr>
                  <th className="px-4 py-3 border text-left">Name</th>
                  <th className="px-4 py-3 border text-left">
                    License Number
                  </th>
                  <th className="px-4 py-3 border text-left">
                    License Type
                  </th>
                  <th className="px-4 py-3 border text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedDrivers.map((d) => (
                  <tr key={d._id} className="border border-black">
                    <td className="px-4 py-3">{d.name}</td>
                    <td className="px-4 py-3">{d.licenseNumber}</td>
                    <td className="px-4 py-3">{d.licenseType}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => router.push(`/driver/update/${d._id}`)}
                        className="bg-black text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="bg-gray-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDrivers.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No drivers found.
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="px-4 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <div className="flex gap-2 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1 border rounded ${
                      p === currentPage ? "bg-black text-white" : ""
                    }`}
                  >
                    {p}
                  </button>
                ))}
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
  );
}
