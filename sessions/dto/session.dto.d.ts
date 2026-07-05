import { SessionType, ScreenType } from '../entities/session.entity';
export declare class CreateSessionDto {
    movieId: number;
    roomName: string;
    screenType?: ScreenType;
    sessionType: SessionType;
    startTime: string;
    price: number;
    totalSeats?: number;
    isActive?: boolean;
}
export declare class UpdateSessionDto {
    roomName?: string;
    screenType?: ScreenType;
    sessionType?: SessionType;
    startTime?: string;
    price?: number;
    isActive?: boolean;
}
export declare class SessionQueryDto {
    page?: number;
    limit?: number;
    movieId?: number;
    date?: string;
    sessionType?: SessionType;
    isActive?: boolean;
}
export declare class ReserveSeatsDto {
    seats: string[];
}
