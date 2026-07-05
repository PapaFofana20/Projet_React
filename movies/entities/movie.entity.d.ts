import { Session } from '../../sessions/entities/session.entity';
export declare enum MovieGenre {
    ACTION = "Action",
    COMEDY = "Com\u00E9die",
    DRAMA = "Drame",
    HORROR = "Horreur",
    ROMANCE = "Romance",
    THRILLER = "Thriller",
    SCI_FI = "Science-Fiction",
    ANIMATION = "Animation",
    DOCUMENTARY = "Documentaire",
    ADVENTURE = "Aventure",
    FANTASY = "Fantaisie",
    WAR = "Guerre",
    MUSICAL = "Musical",
    MYSTERY = "Myst\u00E8re",
    WESTERN = "Western"
}
export declare enum MovieRating {
    G = "G",
    PG = "PG",
    PG_13 = "PG-13",
    R = "R",
    NC_17 = "NC-17"
}
export declare class Movie {
    id: number;
    title: string;
    synopsis: string;
    posterUrl: string;
    trailerUrl: string;
    genres: MovieGenre[];
    duration: number;
    releaseYear: number;
    director: string;
    rating: MovieRating;
    cast: string;
    language: string;
    subtitles: string;
    averageRating: number;
    voteCount: number;
    isShowing: boolean;
    isFeatured: boolean;
    sessions: Session[];
    createdAt: Date;
    updatedAt: Date;
}
