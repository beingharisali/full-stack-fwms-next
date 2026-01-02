export interface Driver {
  _id?: string;
  name: string;
  licenseNumber: string;
  licenseType: 'Motorcycle' | 'LTV' | 'HTV' | 'PSV';
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}
