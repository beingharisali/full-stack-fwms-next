import axios from "axios";
import http from "./http";
import { Driver } from "../types/driver";

export interface DriversResponse {
    drivers: Driver[];
    totalDrivers: number; 
    totalPages: number;
}

export type DriverFilters = {
    licenseType?: string;
    available?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

// GET paginated drivers with filters
export const getDrivers = async (
    page: number = 1,
    limit: number = 10,
    filters?: DriverFilters,
): Promise<DriversResponse> => {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (filters?.licenseType) params.append("licenseType", filters.licenseType);
        if (filters?.available) params.append("available", filters.available);
        if (filters?.sortBy) params.append("sortBy", filters.sortBy);
        if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

        const res = await http.get(`/drivers?${params.toString()}`);
        
        // Old logic maintained: Mapping 'count' to 'totalDrivers'
        return {
            drivers: Array.isArray(res.data.drivers) ? res.data.drivers : [],
            totalDrivers: res.data.count || 0, 
            totalPages: Math.ceil((res.data.count || 0) / limit),
        };
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const msg = err.response?.data?.msg || err.response?.data?.error || err.message;
            console.error("Get Drivers Error:", msg);
        }
        throw err;
    }
};

// GET driver by ID
export const getDriverById = async (driverId: string): Promise<Driver> => {
    try {
        const res = await http.get(`/drivers/${driverId}`);
        // Support for both wrapped and unwrapped data
        return res.data.driver || res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const msg = err.response?.data?.msg || err.response?.data?.error || err.message;
            console.error("Get Driver By ID Error:", msg);
        }
        throw err;
    }
};

// GET my driver profile (for logged-in driver)
export const getMyDriverProfile = async (): Promise<Driver> => {
    try {
        const res = await http.get(`/drivers/profile/me`);
        return res.data.driver;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const msg = err.response?.data?.msg || err.response?.data?.error || err.message;
            console.error("Get My Driver Profile Error:", msg);
        }
        throw err;
    }
};

// CREATE driver
export const createDriver = async (data: {
    name: string;
    email?: string;
    password?: string;
    licenseNumber: string;
    licenseType: "HTV" | "LTV";
}): Promise<any> => {
    try {
        const res = await http.post("/drivers", data);
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            // Priority: Backend Msg -> Backend Error -> Axios Message
            const serverMsg = err.response?.data?.msg || err.response?.data?.error || err.message;
            console.error("Create Driver Error:", serverMsg);
        } else {
            console.error("Unexpected Create Driver Error:", err);
        }
        throw err;
    }
};

// UPDATE driver
export const updateDriver = async (
    driverId: string,
    data: Partial<Driver>,
): Promise<Driver> => {
    try {
        const res = await http.put(`/drivers/${driverId}`, data);
        return res.data.driver || res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const msg = err.response?.data?.msg || err.response?.data?.error || err.message;
            console.error("Update Driver Error:", msg);
        }
        throw err;
    }
};

// DELETE driver
export const deleteDriver = async (driverId: string) => {
    try {
        const res = await http.delete(`/drivers/${driverId}`);
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const msg = err.response?.data?.msg || err.response?.data?.error || err.message;
            console.error("Delete Driver Error:", msg);
        }
        throw err;
    }
};

// ASSIGN vehicle to driver
export const assignVehicleToDriver = async (
    driverId: string,
    vehicleId: string,
) => {
    try {
        const res = await http.post("/drivers/assign-vehicle", {
            driverId,
            vehicleId,
        });
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const msg = err.response?.data?.msg || err.response?.data?.error || err.message;
            console.error("Assign Vehicle Error:", msg);
        }
        throw err;
    }
};

// UNASSIGN vehicle from driver
export const unassignVehicleFromDriver = async (driverId: string) => {
    try {
        const res = await http.put(`/drivers/unassign-vehicle/${driverId}`, {});
        return res.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const msg = err.response?.data?.msg || err.response?.data?.error || err.message;
            console.error("Unassign Vehicle Error:", msg);
        }
        throw err;
    }
};