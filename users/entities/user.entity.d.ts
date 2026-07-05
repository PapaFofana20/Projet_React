import { Role } from '../../auth/entities/role.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    status: UserStatus;
    avatarUrl: string;
    dateOfBirth: Date | null;
    roles: Role[];
    bookings: Booking[];
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
}
