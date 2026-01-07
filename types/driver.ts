export type Driver = {
  id: string;
  name: string;
  licenseNumber: string;
  licenseType: 'HTV' | 'LTV'; // 👈 backend enum jaisa
  available: boolean;
};
