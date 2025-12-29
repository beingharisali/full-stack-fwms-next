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
