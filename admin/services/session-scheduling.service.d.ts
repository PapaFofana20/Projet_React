import { Repository } from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Hall } from '../../cinemas/entities/hall.entity';
import { CreateSessionDto, UpdateSessionDto } from '../dto/session.dto';
export interface SessionConflict {
    existingSession: Session;
    conflictType: 'overlap' | 'adjacent';
    overlapMinutes?: number;
}
export interface SessionValidationResult {
    isValid: boolean;
    conflicts: SessionConflict[];
    calculatedEndTime: Date;
    warnings: string[];
}
export declare class SessionSchedulingService {
    private readonly sessionRepository;
    private readonly movieRepository;
    private readonly hallRepository;
    constructor(sessionRepository: Repository<Session>, movieRepository: Repository<Movie>, hallRepository: Repository<Hall>);
    createSession(dto: CreateSessionDto): Promise<{
        session: Session;
        validation: SessionValidationResult;
    }>;
    validateSession(hallId: number, startTime: Date, endTime: Date, excludeSessionId?: number): Promise<SessionValidationResult>;
    updateSession(sessionId: number, dto: UpdateSessionDto): Promise<Session>;
    getSessionsByCinemaAndDateRange(cinemaId: number, startDate: Date, endDate: Date): Promise<Session[]>;
    getCinemaCalendar(cinemaId: number, startDate: Date, endDate: Date): Promise<Map<string, Session[]>>;
    findGaps(hallId: number, startDate: Date, endDate: Date, minGapMinutes?: number): Promise<{
        start: Date;
        end: Date;
        durationMinutes: number;
    }[]>;
}
