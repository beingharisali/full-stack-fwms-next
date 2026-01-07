"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getDriverById, updateDriver, deleteDriver } from "@/services/driver.api";
import { Driver } from "@/types/driver";
import Sidebar from "../../../component/sidebar";
import Navbar from "../../../component/navbar";

export default function UpdateDriver() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchDriver();
  }, [id]);

  const fetchDriver = async () => {
    try {
      setLoading(true);
      const data = await getDriverById(id!);
      setDriver(data);
    } catch (err) {
      setError("Failed to fetch driver");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!driver || !driver.name || !driver.licenseNumber || !driver.licenseType) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setSaving(true);
      await updateDriver(id!, {
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        licenseType: driver.licenseType,
      });
      router.push("/driver");
    } catch (err) {
      alert("Failed to update driver");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    try {
      await deleteDriver(id!);
      router.push("/driver");
    } catch (err) {
      alert("Failed to delete driver");
      console.error(err);
    }
  };

  if (loading) return <p className="p-10">Loading driver...</p>;
  if (error || !driver) return <p className="p-10 text-red-500">{error || "Driver not found"}</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
            <h1 className="mb-6 text-center text-2xl font-bold">Edit Driver</h1>
            <div className="flex flex-col gap-4">
              <input
                value={driver.name}
                placeholder="Name"
                onChange={(e) => setDriver({ ...driver, name: e.target.value })}
                disabled={saving}
                className="rounded-lg border p-3"
              />
              <input
                value={driver.licenseNumber}
                placeholder="License Number"
                onChange={(e) => setDriver({ ...driver, licenseNumber: e.target.value })}
                disabled={saving}
                className="rounded-lg border p-3"
              />
              <select
                value={driver.licenseType}
                onChange={(e) => setDriver({ ...driver, licenseType: e.target.value as "HTV" | "LTV" })}
                disabled={saving}
                className="rounded-lg border p-3"
              >
                <option value="HTV">HTV</option>
                <option value="LTV">LTV</option>
              </select>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
                >
                  {saving ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
