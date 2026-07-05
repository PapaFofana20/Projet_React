import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Session } from './entities/session.entity';
import { MoviesService } from '../movies/movies.service';
import { CreateSessionDto, UpdateSessionDto, SessionQueryDto } from './dto/session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session) private sessions: Repository<Session>,
    private movies: MoviesService,
  ) {}

  // ========== CRÉER ==========
  async create(dto: CreateSessionDto) {
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

  // ========== LISTE ==========
  findAll(query: SessionQueryDto) {
    const { page = 1, limit = 20, movieId, date, sessionType, isActive } = query;
    const qb = this.sessions.createQueryBuilder('s').leftJoinAndSelect('s.movie', 'movie');

    if (movieId) qb.andWhere('s.movieId = :mid', { mid: movieId });

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      qb.andWhere('s.startTime BETWEEN :start AND :end', { start: d, end });
    }

    if (sessionType) qb.andWhere('s.sessionType = :type', { type: sessionType });
    if (isActive !== undefined) qb.andWhere('s.isActive = :v', { v: isActive });

    return qb.andWhere('s.startTime >= :now', { now: new Date() })
      .orderBy('s.startTime', 'ASC').skip((page - 1) * limit).take(limit)
      .getManyAndCount().then(([data, total]) => ({
        data, total, page, limit, pages: Math.ceil(total / limit)
      }));
  }

  // ========== UN SEUL ==========
  async findOne(id: number) {
    const session = await this.sessions.findOne({ where: { id }, relations: ['movie'] });
    if (!session) throw new NotFoundException(`Séance ${id} non trouvée`);
    return session;
  }

  // ========== PAR FILM / DATE ==========
  findByMovie(movieId: number) {
    return this.sessions.find({
      where: { movieId, isActive: true, startTime: MoreThanOrEqual(new Date()) },
      relations: ['movie'],
      order: { startTime: 'ASC' },
    });
  }

  findByDate(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    return this.sessions.find({
      where: { startTime: Between(start, end), isActive: true },
      relations: ['movie'],
      order: { startTime: 'ASC' },
    });
  }

  // ========== MODIFIER ==========
  async update(id: number, dto: UpdateSessionDto) {
    const session = await this.sessions.findOne({ where: { id } });
    if (!session) throw new NotFoundException(`Séance ${id} non trouvée`);

    if (dto.startTime) {
      const movie = await this.movies.findOne(session.movieId);
      const start = new Date(dto.startTime);
      const end = new Date(start.getTime() + movie.duration * 60000);
      await this.sessions.update(id, { ...dto, startTime: start, endTime: end });
    } else {
      await this.sessions.update(id, dto);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const session = await this.sessions.findOne({ where: { id } });
    if (!session) throw new NotFoundException(`Séance ${id} non trouvée`);
    await this.sessions.remove(session);
    return { message: 'Séance supprimée' };
  }

  // ========== PLACES ==========
  async reserveSeats(id: number, seats: string[]) {
    const session = await this.findOne(id);

    if (session.availableSeats < seats.length) {
      throw new BadRequestException(`Plus que ${session.availableSeats} places disponibles`);
    }

    const deja = seats.filter(s => session.reservedSeats.includes(s));
    if (deja.length > 0) throw new BadRequestException(`Places ${deja.join(', ')} déjà prises`);

    await this.sessions.update(id, {
      reservedSeats: [...session.reservedSeats, ...seats],
      availableSeats: session.availableSeats - seats.length,
    });

    return { success: true, reservedSeats: seats };
  }

  async releaseSeats(id: number, seats: string[]) {
    const session = await this.findOne(id);
    const aLiberer = seats.filter(s => session.reservedSeats.includes(s));

    if (aLiberer.length === 0) throw new BadRequestException('Aucune place à libérer');

    await this.sessions.update(id, {
      reservedSeats: session.reservedSeats.filter(s => !aLiberer.includes(s)),
      availableSeats: session.availableSeats + aLiberer.length,
    });

    return { success: true, releasedSeats: aLiberer };
  }

  // ========== STATS ==========
  stats() {
    return Promise.all([
      this.sessions.count(),
      this.sessions.count({ where: { isActive: true } }),
      this.sessions.count({ where: { isActive: true, startTime: MoreThanOrEqual(new Date()) } }),
    ]).then(([total, active, upcoming]) => ({ total, active, upcoming }));
  }
}
