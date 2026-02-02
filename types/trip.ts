export interface Trip {
	_id?: string;
	departure: string;
	destination: string;
	arrivalTime: string;
	departureTime: string;
	status?:
		| "unassigned"
		| "assigned"
		| "in-progress"
		| "completed"
		| "Pending"
		| "Ongoing"
		| "Completed";
	pickup?: string;
	drop?: string;
	date: Date;
	createdBy?: string;
	assignedDriver?: {
		_id: string;
		name: string;
		licenseNumber: string;
		licenseType: string;
	} | null;
	createdAt?: Date;
	updatedAt?: string;
}
