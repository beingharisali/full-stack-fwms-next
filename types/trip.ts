
export interface Trip {
  id: string;
  departure: string;
  destination: string;
  arrivalTime: string;
  departureTime: string;
  date: Date;       
  createdAt?: string;
  updatedAt?: string;
}
