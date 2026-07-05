import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { User, UserStatus } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Session } from '../sessions/entities/session.entity';
import { Cinema } from '../cinemas/entities/cinema.entity';
import { Hall } from '../cinemas/entities/hall.entity';
import { SeatLayout } from '../cinemas/entities/seat-layout.entity';
import { Role, RoleName } from '../auth/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Booking) private bookings: Repository<Booking>,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Movie) private movies: Repository<Movie>,
    @InjectRepository(Session) private sessions: Repository<Session>,
    @InjectRepository(Cinema) private cinemas: Repository<Cinema>,
    @InjectRepository(Hall) private halls: Repository<Hall>,
    @InjectRepository(SeatLayout) private seatLayouts: Repository<SeatLayout>,
    @InjectRepository(Role) private roles: Repository<Role>,
  ) {}

  // ========== STATISTIQUES GÉNÉRALES ==========
  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Stats réservations
    const [
      totalBookings,
      monthlyBookings,
      yearlyBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
    ] = await Promise.all([
      this.bookings.count(),
      this.bookings.count({
        where: { createdAt: Between(startOfMonth, endOfMonth) }
      }),
      this.bookings.count({
        where: { createdAt: MoreThanOrEqual(startOfYear) }
      }),
      this.bookings.count({ where: { status: BookingStatus.PENDING } }),
      this.bookings.count({ where: { status: BookingStatus.CONFIRMED } }),
      this.bookings.count({ where: { status: BookingStatus.CANCELLED } }),
    ]);

    // Revenus
    const [monthlyRevenue, yearlyRevenue, totalRevenue] = await Promise.all([
      this.getRevenueForPeriod(startOfMonth, endOfMonth),
      this.getRevenueForPeriod(startOfYear, endOfMonth),
      this.getTotalRevenue(),
    ]);

    // Utilisateurs
    const [totalUsers, monthlyUsers, activeUsers] = await Promise.all([
      this.users.count(),
      this.users.count({ where: { createdAt: Between(startOfMonth, endOfMonth) } }),
      this.users.count({ where: { status: UserStatus.ACTIVE } }),
    ]);

    // Films et séances
    const [totalMovies, activeMovies, totalSessions, activeSessions, totalCinemas] = await Promise.all([
      this.movies.count(),
      this.movies.count({ where: { isShowing: true } }),
      this.sessions.count(),
      this.sessions.count({ where: { isActive: true } }),
      this.cinemas.count({ where: { isActive: true } }),
    ]);

    return {
      bookings: {
        total: totalBookings,
        thisMonth: monthlyBookings,
        thisYear: yearlyBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
      },
      revenue: {
        total: totalRevenue,
        thisMonth: monthlyRevenue,
        thisYear: yearlyRevenue,
        currency: 'FCFA',
      },
      users: {
        total: totalUsers,
        thisMonth: monthlyUsers,
        active: activeUsers,
      },
      movies: {
        total: totalMovies,
        showing: activeMovies,
      },
      sessions: {
        total: totalSessions,
        active: activeSessions,
      },
      cinemas: {
        total: totalCinemas,
      },
    };
  }

  // ========== STATISTIQUES EN TEMPS RÉEL ==========
  async getRealtimeStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = await this.sessions.find({
      where: {
        startTime: Between(today, tomorrow),
        isActive: true,
      },
    });

    const sessionIds = todaySessions.map(s => s.id);

    const todayBookings = sessionIds.length > 0
      ? await this.bookings.createQueryBuilder('b')
          .where('b.sessionId IN (:...ids)', { ids: sessionIds })
          .andWhere('b.status IN (:...statuses)', {
            statuses: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
          })
          .getCount()
      : 0;

    const todayRevenue = sessionIds.length > 0
      ? await this.bookings
          .createQueryBuilder('b')
          .select('SUM(b.totalPrice)', 'total')
          .where('b.sessionId IN (:...ids)', { ids: sessionIds })
          .andWhere('b.status IN (:...statuses)', {
            statuses: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
          })
          .getRawOne()
      : { total: 0 };

    const totalAvailableSeats = todaySessions.reduce((sum, s) => sum + s.availableSeats, 0);
    const totalSeats = todaySessions.reduce((sum, s) => sum + s.totalSeats, 0);

    return {
      today: {
        sessions: todaySessions.length,
        bookings: todayBookings,
        revenue: Number(todayRevenue?.total || 0),
        availableSeats: totalAvailableSeats,
        totalSeats: totalSeats,
        occupancyRate: totalSeats > 0
          ? Math.round(((totalSeats - totalAvailableSeats) / totalSeats) * 100)
          : 0,
      },
      sessions: todaySessions.map(s => ({
        id: s.id,
        startTime: s.startTime,
        roomName: s.roomName,
        availableSeats: s.availableSeats,
        totalSeats: s.totalSeats,
      })),
    };
  }

  // ========== STATISTIQUES MENSUELLES ==========
  async getMonthlyStats() {
    const stats: Array<{
      month: string;
      monthIndex: number;
      year: number;
      bookings: number;
      revenue: number;
    }> = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const [bookings, revenue] = await Promise.all([
        this.bookings.count({
          where: { createdAt: Between(monthStart, monthEnd) }
        }),
        this.getRevenueForPeriod(monthStart, monthEnd),
      ]);

      stats.push({
        month: monthStart.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        monthIndex: monthStart.getMonth(),
        year: monthStart.getFullYear(),
        bookings,
        revenue,
      });
    }

    return stats;
  }

  // ========== GESTION DES UTILISATEURS ==========
  async getUsers(params: { page?: number; limit?: number; status?: string; role?: string }) {
    const { page = 1, limit = 20, status, role } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.users.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users.map(u => ({
        ...u,
        password: undefined,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.users.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    return user;
  }

  async createUser(dto: any): Promise<User> {
    const existingUser = await this.users.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('Un utilisateur avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.users.create({
      ...dto,
      password: hashedPassword,
    }) as unknown as User;

    // Assigner le rôle par défaut
    const defaultRole = await this.roles.findOne({
      where: { name: dto.roleName || RoleName.AGENT },
    });

    if (defaultRole) {
      user.roles = [defaultRole];
    }

    return this.users.save(user);
  }

  async updateUserStatus(id: number, status: string): Promise<User> {
    const user = await this.getUserById(id);
    user.status = status as UserStatus;
    return this.users.save(user);
  }

  async assignRole(id: number, roleName: string, cinemaId?: number): Promise<User> {
    const user = await this.getUserById(id);
    const role = await this.roles.findOne({ where: { name: roleName as RoleName } });

    if (!role) {
      throw new NotFoundException(`Rôle ${roleName} non trouvé`);
    }

    user.roles = [role];
    return this.users.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    user.status = UserStatus.SUSPENDED;
    await this.users.save(user);
  }

  // ========== GESTION DES CINÉMAS ==========
  async getCinemas(): Promise<Cinema[]> {
    return this.cinemas.find({
      relations: ['halls'],
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getCinemaById(id: number): Promise<Cinema> {
    const cinema = await this.cinemas.findOne({
      where: { id },
      relations: ['halls', 'halls.seatLayouts'],
    });
    if (!cinema) {
      throw new NotFoundException(`Cinéma avec l'ID ${id} non trouvé`);
    }
    return cinema;
  }

  async createCinema(dto: any): Promise<Cinema> {
    const cinema = this.cinemas.create(dto) as unknown as Cinema;
    return this.cinemas.save(cinema);
  }

  async updateCinema(id: number, dto: any): Promise<Cinema> {
    const cinema = await this.getCinemaById(id);
    Object.assign(cinema, dto);
    return this.cinemas.save(cinema);
  }

  async deleteCinema(id: number): Promise<void> {
    const cinema = await this.getCinemaById(id);
    cinema.isActive = false;
    await this.cinemas.save(cinema);
  }

  // ========== GESTION DES SALLES ==========
  async getHalls(cinemaId?: number): Promise<Hall[]> {
    const where = cinemaId ? { cinemaId, isActive: true } : { isActive: true };
    return this.halls.find({
      where,
      relations: ['cinema', 'seatLayouts'],
      order: { name: 'ASC' },
    });
  }

  async getHallById(id: number): Promise<Hall> {
    const hall = await this.halls.findOne({
      where: { id },
      relations: ['cinema', 'seatLayouts'],
    });
    if (!hall) {
      throw new NotFoundException(`Salle avec l'ID ${id} non trouvée`);
    }
    return hall;
  }

  async createHall(dto: any): Promise<Hall> {
    const hall = this.halls.create(dto) as unknown as Hall;
    const savedHall = await this.halls.save(hall) as unknown as Hall;

    // Générer la grille de sièges
    const seatGrid: Record<string, any> = {};
    const vipSeats: string[] = [];
    const vipRowCount = dto.vipRows || 2;

    for (let row = 0; row < dto.rowCount; row++) {
      const rowLetter = String.fromCharCode(65 + row);
      for (let seat = 1; seat <= dto.seatsPerRow; seat++) {
        const seatId = `${rowLetter}${seat}`;
        const isVip = row >= dto.rowCount - vipRowCount;
        seatGrid[seatId] = { type: isVip ? 'vip' : 'standard', status: 'available' };
        if (isVip) vipSeats.push(seatId);
      }
    }

    const seatLayout = this.seatLayouts.create({
      hallId: savedHall.id,
      seatGrid,
      vipSeats,
    });
    await this.seatLayouts.save(seatLayout);

    return this.getHallById(savedHall.id);
  }

  async updateHall(id: number, dto: any): Promise<Hall> {
    const hall = await this.getHallById(id);
    Object.assign(hall, dto);
    return this.halls.save(hall);
  }

  async deleteHall(id: number): Promise<void> {
    const hall = await this.getHallById(id);
    hall.isActive = false;
    await this.halls.save(hall);
  }

  async getHallSeatLayout(hallId: number): Promise<SeatLayout> {
    const layout = await this.seatLayouts.findOne({ where: { hallId } });
    if (!layout) {
      throw new NotFoundException(`Disposition non trouvée pour la salle ${hallId}`);
    }
    return layout;
  }

  async updateSeatStatus(hallId: number, seatId: string, status: string): Promise<SeatLayout> {
    const layout = await this.getHallSeatLayout(hallId);
    if (layout.seatGrid[seatId]) {
      layout.seatGrid[seatId].status = status;
      await this.seatLayouts.save(layout);
    }
    return layout;
  }

  // ========== GESTION DES FILMS ==========
  async getMovies(params: { status?: string; genre?: string }): Promise<Movie[]> {
    const where: any = {};
    if (params.status === 'now_showing') where.isShowing = true;
    if (params.genre) where.genres = params.genre;

    return this.movies.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movies.findOne({
      where: { id },
      relations: ['sessions'],
    });
    if (!movie) {
      throw new NotFoundException(`Film avec l'ID ${id} non trouvé`);
    }
    return movie;
  }

  async createMovie(dto: any): Promise<Movie> {
    const movie = this.movies.create(dto) as unknown as Movie;
    return this.movies.save(movie);
  }

  async updateMovie(id: number, dto: any): Promise<Movie> {
    const movie = await this.getMovieById(id);
    Object.assign(movie, dto);
    return this.movies.save(movie);
  }

  async toggleFeatured(id: number, featured: boolean): Promise<Movie> {
    const movie = await this.getMovieById(id);
    movie.isFeatured = featured;
    return this.movies.save(movie);
  }

  async updateMovieStatus(id: number, status: string): Promise<Movie> {
    const movie = await this.getMovieById(id);
    movie.isShowing = status === 'now_showing';
    return this.movies.save(movie);
  }

  async deleteMovie(id: number): Promise<void> {
    const movie = await this.getMovieById(id);
    const sessions = await this.sessions.find({ where: { movieId: id, isActive: true } });
    if (sessions.length > 0) {
      throw new BadRequestException('Impossible de supprimer un film avec des séances actives');
    }
    await this.movies.remove(movie);
  }

  // ========== GESTION DES SÉANCES ==========
  async getSessions(params: any): Promise<Session[]> {
    const queryBuilder = this.sessions.createQueryBuilder('session')
      .leftJoinAndSelect('session.movie', 'movie')
      .orderBy('session.startTime', 'ASC');

    if (params.cinemaId) {
      queryBuilder.leftJoin('session.hall', 'hall')
        .andWhere('hall.cinemaId = :cinemaId', { cinemaId: params.cinemaId });
    }
    if (params.hallId) {
      queryBuilder.andWhere('session.hallId = :hallId', { hallId: params.hallId });
    }
    if (params.movieId) {
      queryBuilder.andWhere('session.movieId = :movieId', { movieId: params.movieId });
    }
    if (params.date) {
      const dateStart = new Date(params.date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(params.date);
      dateEnd.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('session.startTime BETWEEN :start AND :end', {
        start: dateStart,
        end: dateEnd,
      });
    }
    if (params.status) {
      queryBuilder.andWhere('session.isActive = :status', {
        status: params.status === 'active',
      });
    }

    return queryBuilder.getMany();
  }

  async getSessionById(id: number): Promise<Session> {
    const session = await this.sessions.findOne({
      where: { id },
      relations: ['movie', 'hall'],
    });
    if (!session) {
      throw new NotFoundException(`Séance avec l'ID ${id} non trouvée`);
    }
    return session;
  }

  async deleteSession(id: number): Promise<void> {
    const session = await this.getSessionById(id);
    session.isActive = false;
    await this.sessions.save(session);
  }

  // ========== GESTION DES RÉSERVATIONS ==========
  async getBookings(params: any): Promise<{ data: Booking[]; meta: any }> {
    const { status, cinemaId, date, page = 1 } = params;
    const limit = 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.bookings.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.session', 'session')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('session.movie', 'movie')
      .orderBy('booking.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (status) {
      queryBuilder.andWhere('booking.status = :status', { status });
    }
    if (cinemaId) {
      queryBuilder.leftJoin('session.hall', 'hall')
        .andWhere('hall.cinemaId = :cinemaId', { cinemaId });
    }
    if (date) {
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('booking.createdAt BETWEEN :start AND :end', {
        start: dateStart,
        end: dateEnd,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBookingById(id: number): Promise<Booking> {
    const booking = await this.bookings.findOne({
      where: { id },
      relations: ['session', 'session.movie', 'user'],
    });
    if (!booking) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
    }
    return booking;
  }

  async updateBookingStatus(id: number, status: BookingStatus): Promise<Booking> {
    const booking = await this.getBookingById(id);
    booking.status = status;
    if (status === BookingStatus.CANCELLED) {
      booking.cancelledAt = new Date();
    }
    return this.bookings.save(booking);
  }

  async refundBooking(id: number): Promise<Booking> {
    const booking = await this.getBookingById(id);
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Seules les réservations confirmées peuvent être remboursées');
    }
    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date();
    // Remettre à jour les places disponibles
    const session = await this.getSessionById(booking.sessionId);
    session.availableSeats += booking.ticketCount;
    booking.seats.forEach(seat => {
      if (!session.reservedSeats) session.reservedSeats = [];
      session.reservedSeats = session.reservedSeats.filter(s => s !== seat);
    });
    await this.sessions.save(session);
    return this.bookings.save(booking);
  }

  // ========== RAPPORTS ==========
  async getSalesReport(startDate: Date, endDate: Date, cinemaId?: number): Promise<any> {
    const queryBuilder = this.bookings.createQueryBuilder('booking')
      .leftJoin('booking.session', 'session')
      .leftJoin('session.hall', 'hall')
      .leftJoin('session.movie', 'movie')
      .where('booking.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
      });

    if (cinemaId) {
      queryBuilder.andWhere('hall.cinemaId = :cinemaId', { cinemaId });
    }

    const bookings = await queryBuilder.getMany();

    const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);
    const byPaymentMethod: Record<string, number> = {};
    const byMovie: Record<string, any> = {};

    bookings.forEach(b => {
      // Par méthode de paiement
      byPaymentMethod[b.paymentMethod] = (byPaymentMethod[b.paymentMethod] || 0) + Number(b.totalPrice);
      // Par film
      if (b.session?.movie) {
        const movieId = b.session.movie.id;
        if (!byMovie[movieId]) {
          byMovie[movieId] = {
            movie: b.session.movie,
            tickets: 0,
            revenue: 0,
          };
        }
        byMovie[movieId].tickets += b.ticketCount;
        byMovie[movieId].revenue += Number(b.totalPrice);
      }
    });

    return {
      period: { start: startDate, end: endDate },
      summary: {
        totalBookings: bookings.length,
        totalTickets: bookings.reduce((sum, b) => sum + b.ticketCount, 0),
        totalRevenue,
        currency: 'FCFA',
      },
      byPaymentMethod: Object.entries(byPaymentMethod).map(([method, revenue]) => ({
        method,
        revenue,
        percentage: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0,
      })),
      byMovie: Object.values(byMovie).sort((a, b) => b.revenue - a.revenue),
    };
  }

  async getOccupancyReport(): Promise<any[]> {
    const halls = await this.halls.find({
      where: { isActive: true },
      relations: ['cinema'],
    });

    return Promise.all(halls.map(async (hall) => {
      const sessions = await this.sessions.find({
        where: { hallId: hall.id, isActive: true },
      });

      const totalSeats = sessions.reduce((sum, s) => sum + s.totalSeats, 0);
      const availableSeats = sessions.reduce((sum, s) => sum + s.availableSeats, 0);
      const bookedSeats = totalSeats - availableSeats;

      return {
        hall: {
          id: hall.id,
          name: hall.name,
          cinema: hall.cinema?.name,
        },
        activeSessions: sessions.length,
        totalSeats,
        bookedSeats,
        availableSeats,
        occupancyRate: totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0,
      };
    }));
  }

  async getTopMovies(limit: number, startDate?: Date, endDate?: Date): Promise<any[]> {
    const where: any = { isShowing: true };
    if (startDate && endDate) {
      where.releaseYear = Between(startDate.getFullYear(), endDate.getFullYear());
    }

    const movies = await this.movies.find({
      where,
      order: { averageRating: 'DESC', voteCount: 'DESC' },
      take: limit,
    });

    return Promise.all(movies.map(async (movie) => {
      const sessions = await this.sessions.find({ where: { movieId: movie.id } });
      const sessionIds = sessions.map(s => s.id);

      const bookingCount = sessionIds.length > 0
        ? await this.bookings
            .createQueryBuilder('b')
            .where('b.sessionId IN (:...ids)', { ids: sessionIds })
            .andWhere('b.status IN (:...statuses)', {
              statuses: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
            })
            .getCount()
        : 0;

      const revenue = sessionIds.length > 0
        ? await this.bookings
            .createQueryBuilder('b')
            .select('SUM(b.totalPrice)', 'total')
            .where('b.sessionId IN (:...ids)', { ids: sessionIds })
            .andWhere('b.status IN (:...statuses)', {
              statuses: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
            })
            .getRawOne()
        : { total: 0 };

      return {
        ...movie,
        bookingCount,
        revenue: Number(revenue?.total || 0),
      };
    }));
  }

  // ========== TOP FILMS (legacy) ==========
  async getTopMoviesOld(limit: number = 5) {
    return this.getTopMovies(limit);
  }

  // ========== TOP UTILISATEURS (legacy) ==========
  async getTopUsers(limit: number = 10) {
    const users = await this.users.find({
      where: { status: UserStatus.ACTIVE },
      relations: ['roles'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const bookings = await this.bookings.find({
          where: { userId: user.id },
        });

        const confirmedBookings = bookings.filter(
          b => [BookingStatus.CONFIRMED, BookingStatus.COMPLETED].includes(b.status)
        );
        const totalSpent = confirmedBookings.reduce(
          (sum, b) => sum + Number(b.totalPrice), 0
        );

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          totalBookings: bookings.length,
          confirmedBookings: confirmedBookings.length,
          totalSpent,
        };
      })
    );

    return usersWithStats.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, limit);
  }

  // ========== RÉSERVATIONS RÉCENTES (legacy) ==========
  async getRecentBookings(limit: number = 10) {
    return this.bookings.find({
      relations: ['session', 'session.movie', 'user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // ========== ANALYSE DES PAIEMENTS (legacy) ==========
  async getPaymentAnalysis() {
    const payments = await this.bookings.find({
      where: {
        status: BookingStatus.CONFIRMED,
      },
      select: ['paymentMethod'],
    });

    const analysis: Record<string, number> = {};
    payments.forEach(b => {
      analysis[b.paymentMethod] = (analysis[b.paymentMethod] || 0) + 1;
    });

    const total = Object.values(analysis).reduce((a, b) => a + b, 0);

    return Object.entries(analysis).map(([method, count]) => ({
      method,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  }

  // ========== SÉANCES POPULAIRES (legacy) ==========
  async getPopularSessions(limit: number = 5) {
    const sessions = await this.sessions.find({
      relations: ['movie'],
      where: { isActive: true },
      order: { availableSeats: 'ASC' },
      take: limit * 3,
    });

    const sessionsWithStats = await Promise.all(
      sessions.map(async (session) => {
        const totalBooked = await this.bookings.count({
          where: {
            sessionId: session.id,
            status: BookingStatus.CONFIRMED,
          },
        });

        return {
          ...session,
          movie: session.movie,
          bookedSeats: session.totalSeats - session.availableSeats,
          occupancyRate: session.totalSeats > 0
            ? Math.round(((session.totalSeats - session.availableSeats) / session.totalSeats) * 100)
            : 0,
          totalBooked,
        };
      })
    );

    return sessionsWithStats
      .filter(s => s.bookedSeats > 0)
      .sort((a, b) => b.bookedSeats - a.bookedSeats)
      .slice(0, limit);
  }

  // ========== PRIVÉ ==========
  private async getRevenueForPeriod(start: Date, end: Date): Promise<number> {
    const result = await this.bookings
      .createQueryBuilder('b')
      .select('SUM(b.totalPrice)', 'total')
      .where('b.createdAt BETWEEN :start AND :end', { start, end })
      .andWhere('b.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]
      })
      .getRawOne();
    return Number(result?.total || 0);
  }

  private async getTotalRevenue(): Promise<number> {
    const result = await this.bookings
      .createQueryBuilder('b')
      .select('SUM(b.totalPrice)', 'total')
      .where('b.status IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]
      })
      .getRawOne();
    return Number(result?.total || 0);
  }
}
