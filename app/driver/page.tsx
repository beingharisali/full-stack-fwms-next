"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDrivers, deleteDriver } from "../../services/driver.api";
import { Driver } from "@/types/driver";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";

/* ===== CONSTANT ===== */
const ITEMS_PER_PAGE = 5;

export default function DriversPage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [licenseType, setLicenseType] = useState("");
  const [available, setAvailable] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  /* ===== FETCH DRIVERS ===== */
  useEffect(() => {
    fetchDrivers();
  }, [page, licenseType, available, sortBy, sortOrder]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);

      const availableValue =
        available === "true"
          ? true
          : available === "false"
          ? false
          : undefined;

      const data = await getDrivers(page, ITEMS_PER_PAGE, {
        licenseType,
        available: availableValue as any,
        sortBy,
        sortOrder,
      });

      setDrivers(Array.isArray(data.drivers) ? data.drivers : []);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch drivers");
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
      console.error(err);
      alert("Failed to delete driver");
    }
  };

  /* ===== LOADING ===== */
  if (loading)
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <p className="p-10 text-black">Loading drivers...</p>
        </div>
      </div>
    );

  /* ===== ERROR ===== */
  if (error)
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <p className="p-10 text-red-500">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 flex-1">
          {/* ===== HEADER ===== */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Drivers</h1>
            <button
              onClick={() => router.push("/driver/create")}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Create Driver
            </button>
          </div>

          {/* ===== FILTERS ===== */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <select
              value={licenseType}
              onChange={(e) => {
                setPage(1);
                setLicenseType(e.target.value);
              }}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-black"
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
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-black"
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
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-black"
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
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-black"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* ===== EMPTY STATE (VEHICLE STYLE) ===== */}
          {drivers.length === 0 ? (
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="text-center py-10 text-gray-500">
                No drivers found. Create your first driver above.
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">License No</th>
                    <th className="px-4 py-3 text-left">License Type</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver._id} className="border-b">
                      <td className="px-4 py-3 text-black">
                        {driver.name}
                      </td>
                      <td className="px-4 py-3 text-black">
                        {driver.licenseNumber}
                      </td>
                      <td className="px-4 py-3 text-black">
                        {driver.licenseType}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              router.push(`/driver/update/${driver._id}`)
                            }
                            className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(driver._id)}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ===== PAGINATION ===== */}
              <div className="flex justify-between items-center p-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="border px-4 py-2 rounded bg-white text-black disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm text-black">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="border px-4 py-2 rounded bg-white text-black disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
