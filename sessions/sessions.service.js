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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("./entities/session.entity");
const movies_service_1 = require("../movies/movies.service");
let SessionsService = class SessionsService {
    constructor(sessions, movies) {
        this.sessions = sessions;
        this.movies = movies;
    }
    async create(dto) {
        const movie = await this.movies.findOne(dto.movieId);
        const start = new Date(dto.startTime);
        const end = new Date(start.getTime() + movie.duration * 60000);
        const session = this.sessions.create({
            ...dto,
            startTime: start,
            endTime: end,
            totalSeats: dto.totalSeats || 100,
            availableSeats: dto.totalSeats || 100,
            reservedSeats: [],
        });
        return this.sessions.save(session);
    }
    findAll(query) {
        const { page = 1, limit = 20, movieId, date, sessionType, isActive } = query;
        const qb = this.sessions.createQueryBuilder('s').leftJoinAndSelect('s.movie', 'movie');
        if (movieId)
            qb.andWhere('s.movieId = :mid', { mid: movieId });
        if (date) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            const end = new Date(d);
            end.setHours(23, 59, 59, 999);
            qb.andWhere('s.startTime BETWEEN :start AND :end', { start: d, end });
        }
        if (sessionType)
            qb.andWhere('s.sessionType = :type', { type: sessionType });
        if (isActive !== undefined)
            qb.andWhere('s.isActive = :v', { v: isActive });
        return qb.andWhere('s.startTime >= :now', { now: new Date() })
            .orderBy('s.startTime', 'ASC').skip((page - 1) * limit).take(limit)
            .getManyAndCount().then(([data, total]) => ({
            data, total, page, limit, pages: Math.ceil(total / limit)
        }));
    }
    async findOne(id) {
        const session = await this.sessions.findOne({ where: { id }, relations: ['movie'] });
        if (!session)
            throw new common_1.NotFoundException(`Séance ${id} non trouvée`);
        return session;
    }
    findByMovie(movieId) {
        return this.sessions.find({
            where: { movieId, isActive: true, startTime: (0, typeorm_2.MoreThanOrEqual)(new Date()) },
            relations: ['movie'],
            order: { startTime: 'ASC' },
        });
    }
    findByDate(date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        return this.sessions.find({
            where: { startTime: (0, typeorm_2.Between)(start, end), isActive: true },
            relations: ['movie'],
            order: { startTime: 'ASC' },
        });
    }
    async update(id, dto) {
        const session = await this.sessions.findOne({ where: { id } });
        if (!session)
            throw new common_1.NotFoundException(`Séance ${id} non trouvée`);
        if (dto.startTime) {
            const movie = await this.movies.findOne(session.movieId);
            const start = new Date(dto.startTime);
            const end = new Date(start.getTime() + movie.duration * 60000);
            await this.sessions.update(id, { ...dto, startTime: start, endTime: end });
        }
        else {
            await this.sessions.update(id, dto);
        }
        return this.findOne(id);
    }
    async remove(id) {
        const session = await this.sessions.findOne({ where: { id } });
        if (!session)
            throw new common_1.NotFoundException(`Séance ${id} non trouvée`);
        await this.sessions.remove(session);
        return { message: 'Séance supprimée' };
    }
    async reserveSeats(id, seats) {
        const session = await this.findOne(id);
        if (session.availableSeats < seats.length) {
            throw new common_1.BadRequestException(`Plus que ${session.availableSeats} places disponibles`);
        }
        const deja = seats.filter(s => session.reservedSeats.includes(s));
        if (deja.length > 0)
            throw new common_1.BadRequestException(`Places ${deja.join(', ')} déjà prises`);
        await this.sessions.update(id, {
            reservedSeats: [...session.reservedSeats, ...seats],
            availableSeats: session.availableSeats - seats.length,
        });
        return { success: true, reservedSeats: seats };
    }
    async releaseSeats(id, seats) {
        const session = await this.findOne(id);
        const aLiberer = seats.filter(s => session.reservedSeats.includes(s));
        if (aLiberer.length === 0)
            throw new common_1.BadRequestException('Aucune place à libérer');
        await this.sessions.update(id, {
            reservedSeats: session.reservedSeats.filter(s => !aLiberer.includes(s)),
            availableSeats: session.availableSeats + aLiberer.length,
        });
        return { success: true, releasedSeats: aLiberer };
    }
    stats() {
        return Promise.all([
            this.sessions.count(),
            this.sessions.count({ where: { isActive: true } }),
            this.sessions.count({ where: { isActive: true, startTime: (0, typeorm_2.MoreThanOrEqual)(new Date()) } }),
        ]).then(([total, active, upcoming]) => ({ total, active, upcoming }));
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        movies_service_1.MoviesService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map