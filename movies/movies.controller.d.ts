import { MoviesService } from './movies.service';
import { CreateMovieDto, UpdateMovieDto, MovieQueryDto } from './dto/movie.dto';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    create(createMovieDto: CreateMovieDto): Promise<import("./entities/movie.entity").Movie>;
    findAll(query: MovieQueryDto): Promise<{
        data: import("./entities/movie.entity").Movie[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findFeatured(): Promise<import("./entities/movie.entity").Movie[]>;
    findNowShowing(): Promise<import("./entities/movie.entity").Movie[]>;
    findByGenre(genre: string): Promise<import("./entities/movie.entity").Movie[]>;
    getStats(): Promise<{
        total: number;
        nowShowing: number;
        featured: number;
    }>;
    findOne(id: number): Promise<import("./entities/movie.entity").Movie>;
    update(id: number, updateMovieDto: UpdateMovieDto): Promise<import("./entities/movie.entity").Movie>;
    rateMovie(id: number, rating: number): Promise<import("./entities/movie.entity").Movie>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
