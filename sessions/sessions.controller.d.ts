import { SessionsService } from './sessions.service';
import { CreateSessionDto, UpdateSessionDto, SessionQueryDto, ReserveSeatsDto } from './dto/session.dto';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    create(createSessionDto: CreateSessionDto): Promise<import("./entities/session.entity").Session>;
    findAll(query: SessionQueryDto): Promise<{
        data: import("./entities/session.entity").Session[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findByMovie(movieId: number): Promise<import("./entities/session.entity").Session[]>;
    findByDate(date: string): Promise<import("./entities/session.entity").Session[]>;
    getStats(): Promise<{
        total: number;
        active: number;
        upcoming: number;
    }>;
    findOne(id: number): Promise<import("./entities/session.entity").Session>;
    update(id: number, updateSessionDto: UpdateSessionDto): Promise<import("./entities/session.entity").Session>;
    reserveSeats(id: number, reserveSeatsDto: ReserveSeatsDto): Promise<{
        success: boolean;
        reservedSeats: string[];
    }>;
    releaseSeats(id: number, reserveSeatsDto: ReserveSeatsDto): Promise<{
        success: boolean;
        releasedSeats: string[];
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
