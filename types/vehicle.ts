export interface Vehicle {
  _id?: string;
  number: string;
  type: 'Car' | 'Bike' | 'Truck' | 'Van';
  status: 'Available' | 'In-Use' | 'Maintenance' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}
