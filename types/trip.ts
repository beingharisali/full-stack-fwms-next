
export interface Trip {
  _id?: string;
  departure: string;
  destination: string;
  arrivalTime: string;
  departureTime: string;
  date: Date;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
