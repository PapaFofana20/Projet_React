import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto, MovieQueryDto } from './dto/movie.dto';
export declare class MoviesService {
    private movies;
    constructor(movies: Repository<Movie>);
    create(dto: CreateMovieDto): Promise<Movie>;
    findAll(query: MovieQueryDto): Promise<{
        data: Movie[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: number): Promise<Movie>;
    findFeatured(): Promise<Movie[]>;
    findNowShowing(): Promise<Movie[]>;
    findByGenre(genre: string, limit?: number): Promise<Movie[]>;
    update(id: number, dto: UpdateMovieDto): Promise<Movie>;
    remove(id: number): Promise<{
        message: string;
    }>;
    rate(id: number, rating: number): Promise<Movie>;
    stats(): Promise<{
        total: number;
        nowShowing: number;
        featured: number;
    }>;
}
