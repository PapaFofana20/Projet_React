import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        user: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            status: import("../users/entities/user.entity").UserStatus;
            avatarUrl: string;
            dateOfBirth: Date | null;
            roles: import("./entities/role.entity").Role[];
            bookings: import("../bookings/entities/booking.entity").Booking[];
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        user: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            status: import("../users/entities/user.entity").UserStatus;
            avatarUrl: string;
            dateOfBirth: Date | null;
            roles: import("./entities/role.entity").Role[];
            bookings: import("../bookings/entities/booking.entity").Booking[];
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date;
        };
    }>;
    refreshToken(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
    }>;
    getProfile(user: User): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: import("../users/entities/user.entity").UserStatus;
        avatarUrl: string;
        dateOfBirth: Date | null;
        roles: import("./entities/role.entity").Role[];
        bookings: import("../bookings/entities/booking.entity").Booking[];
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date;
    }>;
    changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
