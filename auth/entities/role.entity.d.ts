import { User } from '../../users/entities/user.entity';
import { Cinema } from '../../cinemas/entities/cinema.entity';
export declare enum RoleName {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    AGENT = "agent",
    USER = "user"
}
export declare enum RoleLevel {
    SUPER_ADMIN = 100,
    ADMIN = 50,
    AGENT = 20,
    USER = 1
}
export declare class Role {
    id: number;
    name: RoleName;
    level: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
    managedCinemas: Cinema[];
}
