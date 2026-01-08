"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDrivers, deleteDriver } from "@/services/driver.api";
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

  
  useEffect(() => {
    fetchDrivers();
  }, [page, licenseType, available]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);

      const data = await getDrivers(page, limit, {
        licenseType,
        available,
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
      setDrivers((prev) => prev.filter((d) => d._id !== driverId));
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

         
          <div className="flex gap-4 mb-6">
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
          </div>

          {drivers.length === 0 ? (
            <p>No drivers found</p>
          ) : (
            <>
              <table className="w-full bg-white rounded-lg shadow overflow-hidden">
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
                      <td className="px-4 py-3">{driver.name}</td>
                      <td className="px-4 py-3">{driver.licenseNumber}</td>
                      <td className="px-4 py-3">{driver.licenseType}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`/driver/update/${driver._id}`)
                          }
                          className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(driver._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
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
