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


export const getDriver = async (id: string): Promise<Driver> => {
  if (!id) throw new Error("Driver ID is required");

  try {
    const res = await http.get(`/drivers/${id}`);
    return res.data.driver;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Get Driver Error:", err.response?.data);
    }
    throw err;
  }
};


export const getDriverById = getDriver;


export type CreateDriverDTO = {
  name: string;
  licenseNumber: string;
  licenseType: "HTV" | "LTV";
};

export const createDriver = async (
  driver: CreateDriverDTO
): Promise<Driver> => {
  if (!driver.name || !driver.licenseNumber || !driver.licenseType) {
    throw new Error("Missing required driver fields");
  }

  try {
    const res = await http.post("/drivers", driver);
    return res.data.driver;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Create Driver Error:", err.response?.data);
    }
    throw err;
  }
};


export const updateDriver = async (
  id: string,
  driver: Partial<Driver>
): Promise<Driver> => {
  if (!id) throw new Error("Driver ID is required");

  try {
    const res = await http.put(`/drivers/${id}`, driver);
    return res.data.driver;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Update Driver Error:", err.response?.data);
    }
    throw err;
  }
};


export const deleteDriver = async (id: string): Promise<void> => {
  if (!id) throw new Error("Driver ID is required");

  try {
    await http.delete(`/drivers/${id}`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Delete Driver Error:", err.response?.data);
    }
    throw err;
  }
};
