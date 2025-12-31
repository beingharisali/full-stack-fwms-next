import http from "./http";
import { Driver } from "@/types/driver";


export const createDriver = async (data: Driver): Promise<Driver> => {
  const res = await http.post("/drivers", data);
  return res.data.data; 
};


export const getDrivers = async (): Promise<Driver[]> => {
  const res = await http.get("/drivers");
  return res.data.data; 
};


export const getDriverById = async (id: string): Promise<Driver> => {
  const res = await http.get(`/drivers/${id}`);
  return res.data.data; 
};


export const updateDriver = async (
  id: string,
  driver: Driver
): Promise<Driver> => {
  const res = await http.put(`/drivers/${id}`, driver);
  return res.data.data; 
};


export const deleteDriver = async (id: string): Promise<void> => {
  await http.delete(`/drivers/${id}`);

};
