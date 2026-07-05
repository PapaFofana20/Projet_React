import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';
export declare class UsersService {
    private users;
    constructor(users: Repository<User>);
    findAll(page?: number, limit?: number): Promise<{
        data: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            status: UserStatus;
            avatarUrl: string;
            dateOfBirth: Date | null;
            roles: import("../auth/entities/role.entity").Role[];
            bookings: import("../bookings/entities/booking.entity").Booking[];
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: number): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: UserStatus;
        avatarUrl: string;
        dateOfBirth: Date | null;
        roles: import("../auth/entities/role.entity").Role[];
        bookings: import("../bookings/entities/booking.entity").Booking[];
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: UserStatus;
        avatarUrl: string;
        dateOfBirth: Date | null;
        roles: import("../auth/entities/role.entity").Role[];
        bookings: import("../bookings/entities/booking.entity").Booking[];
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date;
    } | null>;
    update(id: number, dto: UpdateUserDto): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: UserStatus;
        avatarUrl: string;
        dateOfBirth: Date | null;
        roles: import("../auth/entities/role.entity").Role[];
        bookings: import("../bookings/entities/booking.entity").Booking[];
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date;
    }>;
    updateStatus(id: number, dto: UpdateUserStatusDto): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: UserStatus;
        avatarUrl: string;
        dateOfBirth: Date | null;
        roles: import("../auth/entities/role.entity").Role[];
        bookings: import("../bookings/entities/booking.entity").Booking[];
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    stats(id: number): Promise<{
        userId: number;
        totalBookings: number;
        totalSpent: number;
        accountCreated: Date;
        lastLogin: Date;
    }>;
    private sanitize;
}
