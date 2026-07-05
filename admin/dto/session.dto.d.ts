import { SessionType } from '../../sessions/entities/session.entity';
export declare class CreateSessionDto {
    movieId: number;
    hallId: number;
    startTime: string;
    sessionType?: SessionType;
    price?: number;
    endTime?: string;
    isActive?: boolean;
}
export declare class UpdateSessionDto {
    movieId?: number;
    hallId?: number;
    startTime?: string;
    endTime?: string;
    sessionType?: SessionType;
    price?: number;
    isActive?: boolean;
}
export declare class CreateMovieDto {
    title: string;
    synopsis: string;
    posterUrl?: string;
    trailerUrl?: string;
    genres: string[];
    duration: number;
    releaseYear: number;
    director: string;
    rating?: string;
    cast?: string;
    language?: string;
    subtitles?: string;
    isShowing?: boolean;
    isFeatured?: boolean;
}
export declare class UpdateMovieDto {
    title?: string;
    synopsis?: string;
    posterUrl?: string;
    genres?: string[];
    duration?: number;
    isShowing?: boolean;
    isFeatured?: boolean;
}
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    dateOfBirth?: string;
}
export declare class UpdateUserStatusDto {
    status: string;
}
export declare class AssignRoleDto {
    roleName: string;
    cinemaId?: number;
}
