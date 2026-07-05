import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { MoviesService } from '../movies/movies.service';
import { CreateSessionDto, UpdateSessionDto, SessionQueryDto } from './dto/session.dto';
export declare class SessionsService {
    private sessions;
    private movies;
    constructor(sessions: Repository<Session>, movies: MoviesService);
    create(dto: CreateSessionDto): Promise<Session>;
    findAll(query: SessionQueryDto): Promise<{
        data: Session[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: number): Promise<Session>;
    findByMovie(movieId: number): Promise<Session[]>;
    findByDate(date: Date): Promise<Session[]>;
    update(id: number, dto: UpdateSessionDto): Promise<Session>;
    remove(id: number): Promise<{
        message: string;
    }>;
    reserveSeats(id: number, seats: string[]): Promise<{
        success: boolean;
        reservedSeats: string[];
    }>;
    releaseSeats(id: number, seats: string[]): Promise<{
        success: boolean;
        releasedSeats: string[];
    }>;
    stats(): Promise<{
        total: number;
        active: number;
        upcoming: number;
    }>;
}
