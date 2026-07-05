import { MovieGenre, MovieRating } from '../entities/movie.entity';
export declare class CreateMovieDto {
    title: string;
    synopsis: string;
    posterUrl?: string;
    trailerUrl?: string;
    genres: MovieGenre[];
    duration: number;
    releaseYear: number;
    director: string;
    rating: MovieRating;
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
    trailerUrl?: string;
    genres?: MovieGenre[];
    duration?: number;
    releaseYear?: number;
    director?: string;
    rating?: MovieRating;
    cast?: string;
    language?: string;
    subtitles?: string;
    isShowing?: boolean;
    isFeatured?: boolean;
}
export declare class MovieQueryDto {
    page?: number;
    limit?: number;
    genre?: MovieGenre;
    search?: string;
    isShowing?: boolean;
    isFeatured?: boolean;
    year?: number;
}
