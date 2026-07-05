import { UserStatus } from '../entities/user.entity';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
    dateOfBirth?: string;
}
export declare class UpdateUserStatusDto {
    status: UserStatus;
}
