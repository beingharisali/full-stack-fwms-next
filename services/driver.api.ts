import http from './http';
import { Driver } from '../types/driver';

export const getDrivers = async (): Promise<Driver[]> => {
  const response = await http.get('/drivers');
  return response.data.drivers;
};

export const getDriver = async (id: string): Promise<Driver> => {
  const response = await http.get(`/drivers/${id}`);
  return response.data.driver;
};

export const createDriver = async (driver: Omit<Driver, '_id' | 'createdAt' | 'updatedAt'>): Promise<Driver> => {
  const response = await http.post('/drivers', driver);
  return response.data.driver;
};

export const updateDriver = async (id: string, driver: Partial<Driver>): Promise<Driver> => {
  const response = await http.put(`/drivers/${id}`, driver);
  return response.data.driver;
};

export const deleteDriver = async (id: string): Promise<void> => {
  await http.delete(`/drivers/${id}`);
};
