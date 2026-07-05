import { Cinema } from './cinema.entity';
import { SeatLayout } from './seat-layout.entity';
import { Session } from '../../sessions/entities/session.entity';
export declare enum ScreenType {
    TWO_D = "2D",
    THREE_D = "3D",
    IMAX = "IMAX",
    DOLBY_ATMOS = "Dolby Atmos",
    VIP = "VIP"
}
export declare class Hall {
    id: number;
    cinemaId: number;
    cinema: Cinema;
    name: string;
    capacity: number;
    screenType: ScreenType;
    rowCount: number;
    seatsPerRow: number;
    basePrice: number;
    vipPrice: number;
    description: string;
    isActive: boolean;
    seatLayouts: SeatLayout[];
    sessions: Session[];
    createdAt: Date;
    updatedAt: Date;
}
