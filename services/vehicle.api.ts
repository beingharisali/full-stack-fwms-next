import http from "./http";
import { Vehicle } from "@/types/vehicle";


export const createVehicle = async (data: Vehicle): Promise<Vehicle> => {
  const res = await http.post("/vehicles", data);
  return res.data.data; 
};


export const getVehicles = async (): Promise<Vehicle[]> => {
  const res = await http.get("/vehicles");
  return res.data.data; 
};


export const getVehicleById = async (id: string): Promise<Vehicle> => {
  const res = await http.get(`/vehicles/${id}`);
  return res.data.data; 
};


export const updateVehicle = async (
  id: string,
  vehicle: Vehicle
): Promise<Vehicle> => {
  const res = await http.put(`/vehicles/${id}`, vehicle);
  return res.data.data; 
};


export const deleteVehicle = async (id: string): Promise<void> => {
  await http.delete(`/vehicles/${id}`);
  ``
};
