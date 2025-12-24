"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTrips, deleteTrip } from "@/services/trip.api";

export interface Trip {
  id: string;
  departure: string;
  destination: string;
  arrivalTime: string;
  departureTime: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrips()
      .then((data) => {   
        setTrips(trips); // corrected from setTrips(trips)
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f0f8ff" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#808080",
        color: "#fff",
        padding: "15px 40px",
        fontSize: "1.8em",
        fontWeight: "bold",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div>Trips</div>
        <button
          onClick={() => router.push("/trips/create")}
          style={{
            backgroundColor: "#333",
            color: "#fff",
            padding: "5px 10px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1em",
          }}
        >
          Create Trip
        </button>
      </div>

      {/* Table */}
      <div style={{ padding: "40px" }}>
        {trips.length === 0 ? (
          <p style={{ color: "#ff4d4f", fontWeight: "bold" }}>No trips saved yet ❌</p>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}>
            <thead style={{ backgroundColor: "#808080", color: "#fff" }}>
              <tr>
                <th style={{ padding: "10px" }}>Departure</th>
                <th style={{ padding: "10px" }}>Date</th>
                <th style={{ padding: "10px" }}>Destination</th>
                <th style={{ padding: "10px" }}>Departure Time</th>
                <th style={{ padding: "10px" }}>Arrival Time</th>
                <th style={{ padding: "10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} style={{ textAlign: "center", color: "#000000" }}>
                  <td style={{ padding: "10px" }}>{trip.departure}</td>
                  <td style={{ padding: "10px" }}>{trip.date}</td>
                  <td style={{ padding: "10px" }}>{trip.destination}</td>
                  <td style={{ padding: "10px" }}>{trip.departureTime || "-"}</td>
                  <td style={{ padding: "10px" }}>{trip.arrivalTime || "-"}</td>
                  <td style={{ padding: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                      onClick={() => router.push(`/trips/update/${trip.id}`)}
                      style={{
                        backgroundColor: "#333",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      style={{
                        backgroundColor: "#333",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
