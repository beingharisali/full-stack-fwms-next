"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDrivers, deleteDriver } from "../../services/driver.api";
import { Driver } from "@/types/driver";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";

export default function DriversPage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  
  const [licenseType, setLicenseType] = useState("");
  const [available, setAvailable] = useState("");

  
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchDrivers();
  }, [page, licenseType, available, sortBy, sortOrder]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);

      const data = await getDrivers(page, limit, {
        licenseType,
        available,
        sortBy,
        sortOrder,
      });

      setDrivers(data.drivers);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to fetch drivers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (driverId: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    try {
      await deleteDriver(driverId);
      setDrivers((prev) => prev.filter((d) => d.id !== driverId));
    } catch (err) {
      alert("Failed to delete driver");
      console.error(err);
    }
  };

  if (loading) return <p className="p-10">Loading drivers...</p>;
  if (error) return <p className="p-10 text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 flex-1">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">Drivers</h1>
            <button
              onClick={() => router.push("/driver/create")}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Create Driver
            </button>
          </div>

          {/* Filters + Sorting */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <select
              value={licenseType}
              onChange={(e) => {
                setPage(1);
                setLicenseType(e.target.value);
              }}
              className="border px-3 py-2 rounded"
            >
              <option value="">All License Types</option>
              <option value="HTV">HTV</option>
              <option value="LTV">LTV</option>
            </select>

            <select
              value={available}
              onChange={(e) => {
                setPage(1);
                setAvailable(e.target.value);
              }}
              className="border px-3 py-2 rounded"
            >
              <option value="">All Drivers</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                setPage(1);
                setSortBy(e.target.value);
              }}
              className="border px-3 py-2 rounded"
            >
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="licenseType">License Type</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setPage(1);
                setSortOrder(e.target.value as "asc" | "desc");
              }}
              className="border px-3 py-2 rounded"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {drivers.length === 0 ? (
            <p>No drivers found</p>
          ) : (
            <>
              <table className="w-full bg-white rounded-lg shadow">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">License No</th>
                    <th className="px-4 py-3">License Type</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="border-b">
                      <td className="px-4 py-3">{driver.name}</td>
                      <td className="px-4 py-3">{driver.licenseNumber}</td>
                      <td className="px-4 py-3">{driver.licenseType}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`/driver/update/${driver.id}`)
                          }
                          className="bg-gray-800 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(driver.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
