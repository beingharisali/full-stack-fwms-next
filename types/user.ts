export type UserRole = "admin" | "manager" | "driver";
export interface User {
	_id?: string;
	firstName: string;
	lastName: string;
	email: string;
	password?: string;
	role: UserRole;
	createdAt?: string;
	updatedAt?: string;
}
export interface AuthResponse {
	user: User;
	token: string;
}
