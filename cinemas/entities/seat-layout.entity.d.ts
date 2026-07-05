import { Hall } from './hall.entity';
export declare enum SeatType {
    STANDARD = "standard",
    VIP = "vip",
    HANDICAPPED = "handicapped",
    COUPLE = "couple"
}
export declare enum SeatStatus {
    AVAILABLE = "available",
    BLOCKED = "blocked",
    MAINTENANCE = "maintenance"
}
export interface SeatConfig {
    type: SeatType | string;
    status: SeatStatus | string;
}
export declare class SeatLayout {
    id: number;
    hallId: number;
    hall: Hall;
    seatGrid: Record<string, SeatConfig>;
    vipSeats: string[];
    handicappedSeats: string[];
    coupleSeats: string[];
    blockedSeats: string[];
}
