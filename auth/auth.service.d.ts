import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../users/entities/user.entity';
import { Role } from './entities/role.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private users;
    private roles;
    private jwt;
    private config;
    constructor(users: Repository<User>, roles: Repository<Role>, jwt: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        user: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            status: UserStatus;
            avatarUrl: string;
            dateOfBirth: Date | null;
            roles: Role[];
            bookings: import("../bookings/entities/booking.entity").Booking[];
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        user: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            status: UserStatus;
            avatarUrl: string;
            dateOfBirth: Date | null;
            roles: Role[];
            bookings: import("../bookings/entities/booking.entity").Booking[];
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date;
        };
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: UserStatus;
        avatarUrl: string;
        dateOfBirth: Date | null;
        roles: Role[];
        bookings: import("../bookings/entities/booking.entity").Booking[];
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date;
    }>;
    refreshToken(userId: number): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
    }>;
    changePassword(userId: number, current: string, novo: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private sanitize;
}
