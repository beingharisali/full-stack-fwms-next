import http from "./http";
import { Trip } from "@/types/trip";

// Create a new trip
export const createTrip = async (data: Trip): Promise<Trip> => {
  const res = await http.post("/trips", data);
  return res.data.data ?? res.data; // return data.data if exists
};

// Get all trips
export const getTrips = async (): Promise<Trip[]> => {
  const res = await http.get("/trips");
  return Array.isArray(res.data.data) ? res.data.data : [];
};

// Get trip by ID
export const getTripById = async (id: string): Promise<Trip> => {
  const res = await http.get(`/trips/${id}`);
  return res.data.data ?? res.data;
};

// Update a trip
export const updateTrip = async (id: string, trip: Trip): Promise<Trip> => {
  const res = await http.put(`/trips/${id}`, trip);
  return res.data.data ?? res.data;
};

// Delete a trip
export const deleteTrip = async (id: string): Promise<void> => {
  await http.delete(`/trips/${id}`);
};

// Assigned trips (for driver)
export const getAssignedTrips = async (): Promise<Trip[]> => {
  try {
    const token = localStorage.getItem("token");
    const res = await http.get("/trips/assigned", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Array.isArray(res.data.data) ? res.data.data : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};
