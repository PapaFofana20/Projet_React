import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Session, SessionType, ScreenType } from '../../sessions/entities/session.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Hall } from '../../cinemas/entities/hall.entity';
import { CreateSessionDto, UpdateSessionDto } from '../dto/session.dto';

/**
 * Durée de nettoyage entre les séances (en minutes)
 */
const CLEANING_DURATION_MINUTES = 20;

/**
 * Intervalle tampon pour la détection des conflits (en minutes)
 * Permet de détecter les séances qui se chevauchent légèrement
 */
const BUFFER_MINUTES = 5;

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

/**
 * Service de gestion des séances avec détection des conflits
 * et calcul automatique des heures de fin
 */
@Injectable()
export class SessionSchedulingService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Hall)
    private readonly hallRepository: Repository<Hall>,
  ) {}

  /**
   * Créer une nouvelle séance avec validation complète
   * - Vérifie que le film et la salle existent
   * - Calcule automatiquement lheure de fin
   * - Détecte les conflits dhoraires
   */
  async createSession(dto: CreateSessionDto): Promise<{
    session: Session;
    validation: SessionValidationResult;
  }> {
    // 1. Récupérer le film pour obtenir la durée
    const movie = await this.movieRepository.findOne({
      where: { id: dto.movieId },
    });

    if (!movie) {
      throw new NotFoundException(`Film avec l'ID ${dto.movieId} non trouvé`);
    }

    // 2. Récupérer la salle pour obtenir le prix de base
    const hall = await this.hallRepository.findOne({
      where: { id: dto.hallId },
    });

    if (!hall) {
      throw new NotFoundException(`Salle avec l'ID ${dto.hallId} non trouvée`);
    }

    if (!hall.isActive) {
      throw new BadRequestException(`La salle ${hall.name} nest pas active`);
    }

    // 3. Calculer lheure de fin
    const startTime = new Date(dto.startTime);
    const durationMinutes = movie.duration + CLEANING_DURATION_MINUTES;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    // 4. Vérifier les conflits
    const validation = await this.validateSession(
      dto.hallId,
      startTime,
      endTime,
      dto.movieId,
    );

    if (!validation.isValid) {
      throw new ConflictException({
        message: 'Conflit détecté avec des séances existantes',
        conflicts: validation.conflicts,
        calculatedEndTime: validation.calculatedEndTime,
      });
    }

    // 5. Créer la séance
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
      sessionType: dto.sessionType || SessionType.STANDARD,
      roomName: hall.name,
      screenType: hall.screenType as unknown as ScreenType,
    };
    const session = this.sessionRepository.create(sessionData) as unknown as Session;
    const savedSession = await this.sessionRepository.save(session) as Session;

    return {
      session: savedSession,
      validation: {
        ...validation,
        calculatedEndTime: endTime,
      },
    };
  }

  /**
   * Valider une séance sans la créer
   * Utile pour prévisualiser les conflits avant création
   */
  async validateSession(
    hallId: number,
    startTime: Date,
    endTime: Date,
    excludeSessionId?: number,
  ): Promise<SessionValidationResult> {
    const warnings: string[] = [];

    // Ajuster les heures avec le tampon pour la détection
    const checkStart = new Date(
      startTime.getTime() - BUFFER_MINUTES * 60 * 1000,
    );
    const checkEnd = new Date(endTime.getTime() + BUFFER_MINUTES * 60 * 1000);

    // Requête pour trouver les séances qui se chevauchent
    const whereCondition: any = {
      hallId,
      isActive: true,
    };

    // Construire la requête en fonction des paramètres
    let queryBuilder = this.sessionRepository
      .createQueryBuilder('session')
      .where('session.hallId = :hallId', { hallId })
      .andWhere('session.isActive = :isActive', { isActive: true });

    // Trouver les séances qui commencent pendant ou juste avant la nouvelle séance
    queryBuilder = queryBuilder.andWhere(
      '(session.startTime BETWEEN :checkStart AND :checkEnd)',
      { checkStart, checkEnd },
    );

    // Trouver les séances qui finissent pendant ou juste après la nouvelle séance
    queryBuilder = queryBuilder.orWhere(
      '(session.endTime BETWEEN :checkStart AND :checkEnd)',
      { checkStart, checkEnd },
    );

    // Trouver les séances qui englobent complètement la nouvelle séance
    queryBuilder = queryBuilder.orWhere(
      '(session.startTime <= :startTime AND session.endTime >= :endTime)',
      { startTime, endTime },
    );

    // Exclure la séance en cours de modification si fourni
    if (excludeSessionId) {
      queryBuilder = queryBuilder.andWhere('session.id != :excludeId', {
        excludeId: excludeSessionId,
      });
    }

    const conflictingSessions = await queryBuilder.getMany();

    // Analyser chaque conflit
    const conflicts: SessionConflict[] = conflictingSessions.map((session) => {
      const existingStart = new Date(session.startTime).getTime();
      const existingEnd = new Date(session.endTime).getTime();
      const newStart = startTime.getTime();
      const newEnd = endTime.getTime();

      let overlapMinutes = 0;
      let conflictType: 'overlap' | 'adjacent' = 'adjacent';

      // Calcul du chevauchement
      if (newStart < existingEnd && newEnd > existingStart) {
        // Il y a un chevauchement réel
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

    // Ajouter des avertissements si nécessaire
    if (conflicts.some((c) => c.conflictType === 'overlap')) {
      warnings.push(
        'Attention: Cette séance chevauche une séance existante!',
      );
    }

    // Vérifier si la séance est pendant les heures douverture
    const hour = startTime.getHours();
    if (hour < 8 || hour >= 23) {
      warnings.push(
        'La séance est programmée en dehors des heures habituelles (8h-23h)',
      );
    }

    return {
      isValid: conflicts.filter((c) => c.conflictType === 'overlap').length === 0,
      conflicts,
      calculatedEndTime: endTime,
      warnings,
    };
  }

  /**
   * Mettre à jour une séance avec revalidation des conflits
   */
  async updateSession(
    sessionId: number,
    dto: UpdateSessionDto,
  ): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Séance avec l'ID ${sessionId} non trouvée`);
    }

    // Si changement de film ou dhoraire, recalculer
    if (dto.movieId || dto.startTime) {
      const movieId = dto.movieId || session.movieId;
      const startTime = dto.startTime
        ? new Date(dto.startTime)
        : session.startTime;

      const movie = await this.movieRepository.findOne({
        where: { id: movieId },
      });

      if (!movie) {
        throw new NotFoundException('Film non trouvé');
      }

      const newEndTime = new Date(
        startTime.getTime() + (movie.duration + CLEANING_DURATION_MINUTES) * 60 * 1000,
      );

      // Valider les nouveaux horaires
      const validation = await this.validateSession(
        dto.hallId || session.hallId,
        startTime,
        newEndTime,
        sessionId,
      );

      if (!validation.isValid) {
        throw new ConflictException({
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

  /**
   * Récupérer les séances dun cinéma pour une période donnée
   */
  async getSessionsByCinemaAndDateRange(
    cinemaId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Session[]> {
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

  /**
   * Récupérer le calendrier complet dun cinéma
   */
  async getCinemaCalendar(
    cinemaId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Map<string, Session[]>> {
    const sessions = await this.getSessionsByCinemaAndDateRange(
      cinemaId,
      startDate,
      endDate,
    );

    // Grouper par date
    const calendar = new Map<string, Session[]>();

    sessions.forEach((session) => {
      const dateKey = session.startTime.toISOString().split('T')[0];
      if (!calendar.has(dateKey)) {
        calendar.set(dateKey, []);
      }
      calendar.get(dateKey)!.push(session);
    });

    return calendar;
  }

  /**
   * Détecter les "trous" dans la programmation (temps sans séance)
   */
  async findGaps(
    hallId: number,
    startDate: Date,
    endDate: Date,
    minGapMinutes: number = 30,
  ): Promise<{ start: Date; end: Date; durationMinutes: number }[]> {
    const sessions = await this.sessionRepository.find({
      where: {
        hallId,
        startTime: Between(startDate, endDate),
        isActive: true,
      },
      order: { startTime: 'ASC' },
    });

    const gaps: { start: Date; end: Date; durationMinutes: number }[] = [];

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
}
