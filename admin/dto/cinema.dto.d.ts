import { ScreenType } from '../../cinemas/entities/hall.entity';
export declare class CreateCinemaDto {
    name: string;
    city: string;
    address: string;
    phone?: string;
    email?: string;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
}
export declare class UpdateCinemaDto {
    name?: string;
    city?: string;
    address?: string;
    phone?: string;
    email?: string;
    isActive?: boolean;
}
export declare class CreateHallDto {
    cinemaId: number;
    name: string;
    capacity: number;
    rowCount: number;
    seatsPerRow: number;
    screenType: ScreenType;
    basePrice: number;
    vipPrice?: number;
    vipRows?: number;
    description?: string;
}
export declare class UpdateHallDto {
    name?: string;
    screenType?: ScreenType;
    basePrice?: number;
    vipPrice?: number;
    isActive?: boolean;
    description?: string;
}
export declare class UpdateSeatDto {
    seatId: string;
    status: string;
}
