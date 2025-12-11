export type UserRole = "admin" | "instructor" | "staff" | "student";
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}
export interface AuthResponse {
  user: User;
  token: string;
}
