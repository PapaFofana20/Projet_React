import { Movie } from '../../movies/entities/movie.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Hall } from '../../cinemas/entities/hall.entity';
export declare enum SessionType {
    STANDARD = "standard",
    THREE_D = "3D",
    IMAX = "IMAX",
    VIP = "VIP",
    DOLBY = "Dolby Atmos"
}
export declare enum ScreenType {
    REGULAR = "regular",
    LARGE = "large",
    SMALL = "small"
}
export declare class Session {
    id: number;
    movieId: number;
    movie: Movie;
    hallId: number;
    hall: Hall;
    roomName: string;
    screenType: ScreenType;
    sessionType: SessionType;
    startTime: Date;
    endTime: Date;
    price: number;
    totalSeats: number;
    availableSeats: number;
    reservedSeats: string[];
    isActive: boolean;
    bookings: Booking[];
    createdAt: Date;
    updatedAt: Date;
}
