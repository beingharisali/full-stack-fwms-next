import http from "./http";
import { Trip } from "@/types/trip";

// Create a new trip
export const createTrip = async (data: Trip): Promise<Trip> => {
  const res = await http.post("/trips", data);
  return res.data.data; // Backend returns { success: true, data: trip }
};

// Get all trips
export async function getTrips(): Promise<Trip[]> {
  const res = await http.get("/trips");
  return res.data.data; // Backend returns { success: true, data: trips }
}

// Get trip by ID
export async function getTripById(id: string): Promise<Trip> {
  const res = await http.get(`/trips/${id}`);
  return res.data.data; // Backend returns { success: true, data: trip }
}

// Update a trip
export async function updateTrip(id: string, trip: Trip): Promise<Trip> {
  const res = await http.put(`/trips/${id}`, trip);
  return res.data.data; // Backend returns { success: true, data: trip }
}

// Delete a trip
export async function deleteTrip(id: string): Promise<void> {
  await http.delete(`/trips/${id}`);
  // Backend returns { success: true, message: "Trip deleted successfully" }
}
import axios from "axios";



export const getDriverTrips = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/driver/trips`,
    { withCredentials: true }
  );
  return res.data;
};


// services/trip.api.ts

export const getAssignedTrips = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/trips/assigned", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch assigned trips");
    }

    const data = await res.json();
    return data; // ye array of trips return kare
  } catch (err) {
    console.error(err);
    return [];
  }
};

