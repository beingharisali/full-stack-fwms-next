export type Driver = {
  _id: string;                   
  id: string;                  
  name: string;
  licenseNumber: string;
  licenseType: "HTV" | "LTV";
  available: boolean;
};

