export interface Driver {
  _id: string; // backend se jo unique ID aati hai, mostly MongoDB _id
  name: string;
  licenseNumber: string;
  licenseType: "HTV" | "LTV";
  available?: boolean;
}
