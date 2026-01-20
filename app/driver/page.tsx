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

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedLicenseType, setSelectedLicenseType] = useState("all");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const res = await getDrivers();
        setDrivers(res.drivers || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch drivers");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    try {
      await deleteDriver(id);
      setDrivers((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const licenseTypes = Array.from(
    new Set(drivers.map((d) => d.licenseType))
  );

  const filteredDrivers = drivers.filter((d) => {
    const matchesLicense =
      selectedLicenseType === "all"
        ? true
        : d.licenseType === selectedLicenseType;

    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());

    return matchesLicense && matchesSearch;
  });

  const totalPages = Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDrivers = filteredDrivers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) {
    return <LoadingBar title="Loading Drivers" duration={2} />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <p className="p-10 text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-4 md:p-8">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-black">Drivers</h1>

            <button
              onClick={() => router.push("/driver/create")}
              className="bg-gray-800 text-white px-5 py-2 rounded-md hover:bg-gray-900 transition"
            >
              Create Driver
            </button>
          </div>

       
          <div className="flex flex-col md:flex-row gap-4 mb-5">
            <input
              type="text"
              placeholder="Search by name or license number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-96 border border-gray-300 rounded-md px-3 py-2 text-black"
            />

            <select
              value={selectedLicenseType}
              onChange={(e) => {
                setSelectedLicenseType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-60 border border-gray-300 rounded-md px-3 py-2 text-black"
            >
              <option value="all">All License Types</option>
              {licenseTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

        
          {paginatedDrivers.length === 0 ? (
            <div className="bg-white p-10 rounded-md text-center text-gray-500 shadow">
              No drivers found
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">License No</th>
                      <th className="p-3 text-left">License Type</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedDrivers.map((d) => (
                      <tr
                        key={d._id}
                        className="border-b last:border-b-0 hover:bg-gray-50 transition"
                      >
                        <td className="p-3 text-black whitespace-nowrap">
                          {d.name}
                        </td>
                        <td className="p-3 text-black whitespace-nowrap">
                          {d.licenseNumber}
                        </td>
                        <td className="p-3 text-black whitespace-nowrap">
                          {d.licenseType}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                router.push(`/driver/update/${d._id}`)
                              }
                              className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(d._id)}
                              className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

         
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-1 border border-gray-400 rounded text-black disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-black">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-1 border border-gray-400 rounded text-black disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
