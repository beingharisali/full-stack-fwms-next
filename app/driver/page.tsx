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
      const data = await getDrivers(page, limit, { licenseType, available, sortBy, sortOrder });
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
      setDrivers((prev) => prev.filter((d) => d._id !== driverId));
    } catch (err) {
      alert("Failed to delete driver");
      console.error(err);
    }
  };

  if (loading) return <p className="p-10 text-black">Loading drivers...</p>;
  if (error) return <p className="p-10 text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 flex-1 bg-white text-black">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold text-black">Drivers</h1>
            <button
              onClick={() => router.push("/driver/create")}
              className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
            >
              Create Driver
            </button>
          </div>

          {/* Filters + Sorting */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <select
              value={licenseType}
              onChange={(e) => { setPage(1); setLicenseType(e.target.value); }}
              className="border px-3 py-2 rounded text-black"
            >
              <option value="">All License Types</option>
              <option value="HTV">HTV</option>
              <option value="LTV">LTV</option>
            </select>

            <select
              value={available}
              onChange={(e) => { setPage(1); setAvailable(e.target.value); }}
              className="border px-3 py-2 rounded text-black"
            >
              <option value="">All Drivers</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => { setPage(1); setSortBy(e.target.value); }}
              className="border px-3 py-2 rounded text-black"
            >
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="licenseType">License Type</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => { setPage(1); setSortOrder(e.target.value as "asc" | "desc"); }}
              className="border px-3 py-2 rounded text-black"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {drivers.length === 0 ? (
            <p className="text-black">No drivers found</p>
          ) : (
            <>
              <table className="w-full bg-gray-50 rounded-lg shadow text-black">
                <thead className="bg-gray-200 text-black">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">License No</th>
                    <th className="px-4 py-3">License Type</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver._id} className="border-b text-black">
                      <td className="px-4 py-3">{driver.name}</td>
                      <td className="px-4 py-3">{driver.licenseNumber}</td>
                      <td className="px-4 py-3">{driver.licenseType}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => router.push(`/driver/update/${driver._id}`)}
                          className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(driver._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center gap-4 mt-6 text-black">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
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
