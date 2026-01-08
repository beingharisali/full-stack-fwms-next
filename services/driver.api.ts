import axios from "axios";
import http from "./http";
import { Driver } from "../types/driver";

export interface DriversResponse {
  drivers: Driver[];
  totalPages: number;
}

export type DriverFilters = {
  licenseType?: string;
  available?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const getDrivers = async (
  page: number = 1,
  limit: number = 10,
  filters?: DriverFilters
): Promise<DriversResponse> => {
  try {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filters?.licenseType) {
      params.append("licenseType", filters.licenseType);
    }

    if (filters?.available) {
      params.append("available", filters.available);
    }

    if (filters?.sortBy) {
      params.append("sortBy", filters.sortBy);
    }

    if (filters?.sortOrder) {
      params.append("sortOrder", filters.sortOrder);
    }

    const res = await http.get(`/drivers?${params.toString()}`);

    return {
      drivers: res.data.drivers,
      totalPages: res.data.totalPages,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Get Drivers Error:", err.response?.data);
    }
    throw err;
  }
};

export const deleteDriver = async (driverId: string) => {
  try {
    const res = await http.delete(`/drivers/${driverId}`);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Delete Driver Error:", err.response?.data);
    }
    throw err;
  }
};
