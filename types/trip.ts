
export interface Trip {
  _id?: string;
  departure: string;
  destination: string;
  arrivalTime: string;
  departureTime: string;
    status: "Pending" | "Ongoing" | "Completed";
  pickup: string;
  drop: string;
  date: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt?: string;
}
