"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSchedulingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("../../sessions/entities/session.entity");
const movie_entity_1 = require("../../movies/entities/movie.entity");
const hall_entity_1 = require("../../cinemas/entities/hall.entity");
const CLEANING_DURATION_MINUTES = 20;
const BUFFER_MINUTES = 5;
let SessionSchedulingService = class SessionSchedulingService {
    constructor(sessionRepository, movieRepository, hallRepository) {
        this.sessionRepository = sessionRepository;
        this.movieRepository = movieRepository;
        this.hallRepository = hallRepository;
    }
    async createSession(dto) {
        const movie = await this.movieRepository.findOne({
            where: { id: dto.movieId },
        });
        if (!movie) {
            throw new common_1.NotFoundException(`Film avec l'ID ${dto.movieId} non trouvé`);
        }
        const hall = await this.hallRepository.findOne({
            where: { id: dto.hallId },
        });
        if (!hall) {
            throw new common_1.NotFoundException(`Salle avec l'ID ${dto.hallId} non trouvée`);
        }
        if (!hall.isActive) {
            throw new common_1.BadRequestException(`La salle ${hall.name} nest pas active`);
        }
        const startTime = new Date(dto.startTime);
        const durationMinutes = movie.duration + CLEANING_DURATION_MINUTES;
        const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
        const validation = await this.validateSession(dto.hallId, startTime, endTime, dto.movieId);
        if (!validation.isValid) {
            throw new common_1.ConflictException({
                message: 'Conflit détecté avec des séances existantes',
                conflicts: validation.conflicts,
                calculatedEndTime: validation.calculatedEndTime,
            });
        }
        const sessionData = {
            movieId: dto.movieId,
            hallId: dto.hallId,
            startTime,
            endTime,
            price: dto.price || hall.basePrice,
            totalSeats: hall.capacity,
            availableSeats: hall.capacity,
            reservedSeats: [],
            isActive: dto.isActive !== false,
            sessionType: dto.sessionType || session_entity_1.SessionType.STANDARD,
            roomName: hall.name,
            screenType: hall.screenType,
        };
        const session = this.sessionRepository.create(sessionData);
        const savedSession = await this.sessionRepository.save(session);
        return {
            session: savedSession,
            validation: {
                ...validation,
                calculatedEndTime: endTime,
            },
        };
    }
    async validateSession(hallId, startTime, endTime, excludeSessionId) {
        const warnings = [];
        const checkStart = new Date(startTime.getTime() - BUFFER_MINUTES * 60 * 1000);
        const checkEnd = new Date(endTime.getTime() + BUFFER_MINUTES * 60 * 1000);
        const whereCondition = {
            hallId,
            isActive: true,
        };
        let queryBuilder = this.sessionRepository
            .createQueryBuilder('session')
            .where('session.hallId = :hallId', { hallId })
            .andWhere('session.isActive = :isActive', { isActive: true });
        queryBuilder = queryBuilder.andWhere('(session.startTime BETWEEN :checkStart AND :checkEnd)', { checkStart, checkEnd });
        queryBuilder = queryBuilder.orWhere('(session.endTime BETWEEN :checkStart AND :checkEnd)', { checkStart, checkEnd });
        queryBuilder = queryBuilder.orWhere('(session.startTime <= :startTime AND session.endTime >= :endTime)', { startTime, endTime });
        if (excludeSessionId) {
            queryBuilder = queryBuilder.andWhere('session.id != :excludeId', {
                excludeId: excludeSessionId,
            });
        }
        const conflictingSessions = await queryBuilder.getMany();
        const conflicts = conflictingSessions.map((session) => {
            const existingStart = new Date(session.startTime).getTime();
            const existingEnd = new Date(session.endTime).getTime();
            const newStart = startTime.getTime();
            const newEnd = endTime.getTime();
            let overlapMinutes = 0;
            let conflictType = 'adjacent';
            if (newStart < existingEnd && newEnd > existingStart) {
                conflictType = 'overlap';
                const overlapStart = Math.max(newStart, existingStart);
                const overlapEnd = Math.min(newEnd, existingEnd);
                overlapMinutes = Math.round((overlapEnd - overlapStart) / (60 * 1000));
            }
            return {
                existingSession: session,
                conflictType,
                overlapMinutes: overlapMinutes > 0 ? overlapMinutes : undefined,
            };
        });
        if (conflicts.some((c) => c.conflictType === 'overlap')) {
            warnings.push('Attention: Cette séance chevauche une séance existante!');
        }
        const hour = startTime.getHours();
        if (hour < 8 || hour >= 23) {
            warnings.push('La séance est programmée en dehors des heures habituelles (8h-23h)');
        }
        return {
            isValid: conflicts.filter((c) => c.conflictType === 'overlap').length === 0,
            conflicts,
            calculatedEndTime: endTime,
            warnings,
        };
    }
    async updateSession(sessionId, dto) {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Séance avec l'ID ${sessionId} non trouvée`);
        }
        if (dto.movieId || dto.startTime) {
            const movieId = dto.movieId || session.movieId;
            const startTime = dto.startTime
                ? new Date(dto.startTime)
                : session.startTime;
            const movie = await this.movieRepository.findOne({
                where: { id: movieId },
            });
            if (!movie) {
                throw new common_1.NotFoundException('Film non trouvé');
            }
            const newEndTime = new Date(startTime.getTime() + (movie.duration + CLEANING_DURATION_MINUTES) * 60 * 1000);
            const validation = await this.validateSession(dto.hallId || session.hallId, startTime, newEndTime, sessionId);
            if (!validation.isValid) {
                throw new common_1.ConflictException({
                    message: 'Conflit détecté avec des séances existantes',
                    conflicts: validation.conflicts,
                });
            }
            session.startTime = startTime;
            session.endTime = newEndTime;
        }
        if (dto.hallId) {
            const hall = await this.hallRepository.findOne({
                where: { id: dto.hallId },
            });
            if (hall) {
                session.hallId = dto.hallId;
                session.roomName = hall.name;
            }
        }
        return this.sessionRepository.save(session);
    }
    async getSessionsByCinemaAndDateRange(cinemaId, startDate, endDate) {
        return this.sessionRepository
            .createQueryBuilder('session')
            .innerJoin('session.hall', 'hall')
            .where('hall.cinemaId = :cinemaId', { cinemaId })
            .andWhere('session.startTime BETWEEN :startDate AND :endDate', {
            startDate,
            endDate,
        })
            .andWhere('session.isActive = :isActive', { isActive: true })
            .orderBy('session.startTime', 'ASC')
            .getMany();
    }
    async getCinemaCalendar(cinemaId, startDate, endDate) {
        const sessions = await this.getSessionsByCinemaAndDateRange(cinemaId, startDate, endDate);
        const calendar = new Map();
        sessions.forEach((session) => {
            const dateKey = session.startTime.toISOString().split('T')[0];
            if (!calendar.has(dateKey)) {
                calendar.set(dateKey, []);
            }
            calendar.get(dateKey).push(session);
        });
        return calendar;
    }
    async findGaps(hallId, startDate, endDate, minGapMinutes = 30) {
        const sessions = await this.sessionRepository.find({
            where: {
                hallId,
                startTime: (0, typeorm_2.Between)(startDate, endDate),
                isActive: true,
            },
            order: { startTime: 'ASC' },
        });
        const gaps = [];
        for (let i = 0; i < sessions.length - 1; i++) {
            const currentEnd = new Date(sessions[i].endTime);
            const nextStart = new Date(sessions[i + 1].startTime);
            const gapMinutes = (nextStart.getTime() - currentEnd.getTime()) / (60 * 1000);
            if (gapMinutes >= minGapMinutes) {
                gaps.push({
                    start: currentEnd,
                    end: nextStart,
                    durationMinutes: Math.round(gapMinutes),
                });
            }
        }
        return gaps;
    }
};
exports.SessionSchedulingService = SessionSchedulingService;
exports.SessionSchedulingService = SessionSchedulingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __param(1, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __param(2, (0, typeorm_1.InjectRepository)(hall_entity_1.Hall)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SessionSchedulingService);
//# sourceMappingURL=session-scheduling.service.js.map