import { Hall } from './hall.entity';
import { Role } from '../../auth/entities/role.entity';
export declare class Cinema {
    id: number;
    name: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    openingHours: {
        dayOfWeek: number;
        openTime: string;
        closeTime: string;
        isOpen: boolean;
    }[];
    isActive: boolean;
    managedById: number;
    managedBy: Role;
    halls: Hall[];
    createdAt: Date;
    updatedAt: Date;
}
