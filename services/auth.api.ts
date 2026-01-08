import http from "./http";
import { User } from "../types/user";

// Login
export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const res = await http.post("/auth/login", { email, password });
  return res.data;
}

// Register
export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: string
): Promise<{ user: User; token: string }> {
  const res = await http.post("/auth/register", {
    firstName,
    lastName,
    email,
    password,
    role,
  });
  return res.data;
}

// ✅ Get all users (backend route /auth/users)
export async function getAllUsers(token: string): Promise<User[]> {
  const res = await http.get("/auth/users", {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Backend likely returns { users: [...] }
  return res.data.users ?? [];
}

// ✅ Delete user by ID (backend route /auth/users/:id)
export async function deleteUser(userId: string, token: string) {
  return await http.delete(`/auth/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Logout
export async function logoutApi(): Promise<void> {
  localStorage.removeItem("token");
}
