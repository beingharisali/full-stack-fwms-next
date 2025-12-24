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
        setTrips(trips);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => router.push("/trips/create")}>
        Create Trip
      </button>

      {trips.length === 0 ? (
        <p>No trips ❌</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Departure</th>
              <th>Date</th>
              <th>Destination</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.departure}</td>
                <td>{trip.date}</td>
                <td>{trip.destination}</td>
                <td>
                  <button
                    onClick={() =>
                      router.push(`/trips/update/${trip.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDelete(trip.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
