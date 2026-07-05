import { UsersService } from './users.service';
import { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: number, limit?: number): Promise<{
        data: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            status: import("./entities/user.entity").UserStatus;
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
        status: import("./entities/user.entity").UserStatus;
        avatarUrl: string;
        dateOfBirth: Date | null;
        roles: import("../auth/entities/role.entity").Role[];
        bookings: import("../bookings/entities/booking.entity").Booking[];
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: import("./entities/user.entity").UserStatus;
        avatarUrl: string;
        dateOfBirth: Date | null;
        roles: import("../auth/entities/role.entity").Role[];
        bookings: import("../bookings/entities/booking.entity").Booking[];
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date;
    }>;
    updateStatus(id: number, updateStatusDto: UpdateUserStatusDto): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: import("./entities/user.entity").UserStatus;
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
    getStats(id: number): Promise<{
        userId: number;
        totalBookings: number;
        totalSpent: number;
        accountCreated: Date;
        lastLogin: Date;
    }>;
}
