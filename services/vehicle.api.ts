import http from './http';
import { Vehicle } from '../types/vehicle';

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await http.get('/vehicles');
  return response.data.vehicles;
};

export const getVehicle = async (id: string): Promise<Vehicle> => {
  const response = await http.get(`/vehicles/${id}`);
  return response.data.vehicle;
};

export const createVehicle = async (
  vehicle: Omit<Vehicle, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Vehicle> => {
  const response = await http.post('/vehicles', vehicle); // ✅ FIXED
  return response.data.vehicle;
};

export const updateVehicle = async (
  id: string,
  vehicle: Partial<Vehicle>
): Promise<Vehicle> => {
  const response = await http.put(`/vehicles/${id}`, vehicle);
  return response.data.vehicle;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await http.delete(`/vehicles/${id}`);
};
