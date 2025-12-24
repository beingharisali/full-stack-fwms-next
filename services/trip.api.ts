import http from "./http";
import { Trip } from "@/types/trip";

// Create a new trip
export const createTrip = async (data: Trip): Promise<Trip> => {
  const res = await fetch("/api/trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create trip");
  }

  return res.json();
};

// Get all trips
export async function getTrips(): Promise<Trip[]> {
  const res = await http.get("/trips");
  return res.data;
}

// Get trip by ID
export async function getTripById(id: string): Promise<Trip> {
  const res = await http.get(`/trips/${id}`);
  return res.data;
}

// Update a trip ✅ (Object-based)
export async function updateTrip(id: string, trip: Trip): Promise<Trip> {
  const res = await http.put(`/trips/${id}`, trip);
  return res.data;
}

// Delete a trip
export async function deleteTrip(id: string): Promise<void> {
  await http.delete(`/trips/${id}`);
}
