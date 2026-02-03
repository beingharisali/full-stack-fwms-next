import http from "./http";
import { Trip } from "@/types/trip";

/**
 * Create a new trip
 */
export const createTrip = async (data: Trip): Promise<Trip> => {
	const res = await http.post("/trips", data);
	return res.data?.data || res.data;
};

/**
 * Get all trips (Admin / Dashboard / Trips Page)
 */
export const getTrips = async (): Promise<Trip[]> => {
	try {
		const res = await http.get("/trips");

		// backend agar { data: [] } bheje
		if (Array.isArray(res.data?.data)) {
			return res.data.data;
		}

		// backend agar direct [] bheje
		if (Array.isArray(res.data)) {
			return res.data;
		}

		return [];
	} catch (error) {
		console.error("Error fetching trips:", error);
		return [];
	}
};

/**
 * Get trip by ID
 */
export const getTripById = async (id: string): Promise<Trip> => {
	const res = await http.get(`/trips/${id}`);
	return res.data?.data || res.data;
};

/**
 * Update a trip
 */
export const updateTrip = async (
	id: string,
	trip: Partial<Trip>,
): Promise<Trip> => {
	const res = await http.put(`/trips/${id}`, trip);
	return res.data?.data || res.data;
};

/**
 * Delete a trip
 */
export const deleteTrip = async (id: string): Promise<void> => {
	await http.delete(`/trips/${id}`);
};

/**
 * Get assigned trips (Driver Dashboard)
 */
export const getAssignedTrips = async (): Promise<Trip[]> => {
	try {
		const token = localStorage.getItem("token");

		const res = await http.get("/trips/assigned", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (Array.isArray(res.data?.data)) {
			return res.data.data;
		}

		if (Array.isArray(res.data)) {
			return res.data;
		}

		return [];
	} catch (error) {
		console.error("Error fetching assigned trips:", error);
		return [];
	}
};

/**
 * Assign a trip to a driver
 */
export const assignTrip = async (
	tripId: string,
	driverId: string,
): Promise<Trip> => {
	const res = await http.post("/trips/assign", { tripId, driverId });
	return res.data?.data || res.data;
};

/**
 * Unassign a trip from a driver
 */
export const unassignTrip = async (tripId: string): Promise<Trip> => {
	const res = await http.post("/trips/unassign", { tripId });
	return res.data?.data || res.data;
};
