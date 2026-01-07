"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDriver } from "../../../services/driver.api";
import Sidebar from "../../component/sidebar";
import Navbar from "../../component/navbar";

export default function CreateDriver() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseType, setLicenseType] = useState<"HTV" | "LTV">("HTV");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !email || !phone || !licenseNumber || !licenseType) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);

      // ✅ API expects THIS payload
      await createDriver({
        name,
        licenseNumber,
        licenseType,
      });

      router.push("/driver");
    } catch (error) {
      console.error("Failed to create driver:", error);
      alert("Failed to create driver. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <div className="flex flex-1 bg-gray-50">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Create Driver 🚗
            </h1>

            <div className="flex flex-col gap-4">
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="rounded-lg border p-3"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="rounded-lg border p-3"
              />

              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="rounded-lg border p-3"
              />

              <input
                placeholder="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                disabled={loading}
                className="rounded-lg border p-3"
              />

              {/* 🔥 FIXED: licenseType instead of vehicleType */}
              <select
                value={licenseType}
                onChange={(e) =>
                  setLicenseType(e.target.value as "HTV" | "LTV")
                }
                disabled={loading}
                className="rounded-lg border p-3"
              >
                <option value="HTV">HTV</option>
                <option value="LTV">LTV</option>
              </select>

              <button
                onClick={handleCreate}
                disabled={loading}
                className="mt-4 rounded-lg bg-blue-600 py-3 font-bold text-white
                  hover:bg-blue-500 transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Save Driver"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
