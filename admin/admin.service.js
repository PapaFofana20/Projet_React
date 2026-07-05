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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const user_entity_1 = require("../users/entities/user.entity");
const movie_entity_1 = require("../movies/entities/movie.entity");
const session_entity_1 = require("../sessions/entities/session.entity");
const cinema_entity_1 = require("../cinemas/entities/cinema.entity");
const hall_entity_1 = require("../cinemas/entities/hall.entity");
const seat_layout_entity_1 = require("../cinemas/entities/seat-layout.entity");
const role_entity_1 = require("../auth/entities/role.entity");
const bcrypt = require("bcrypt");
let AdminService = class AdminService {
    constructor(bookings, users, movies, sessions, cinemas, halls, seatLayouts, roles) {
        this.bookings = bookings;
        this.users = users;
        this.movies = movies;
        this.sessions = sessions;
        this.cinemas = cinemas;
        this.halls = halls;
        this.seatLayouts = seatLayouts;
        this.roles = roles;
    }
    async getDashboardStats() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const [totalBookings, monthlyBookings, yearlyBookings, pendingBookings, confirmedBookings, cancelledBookings,] = await Promise.all([
            this.bookings.count(),
            this.bookings.count({
                where: { createdAt: (0, typeorm_2.Between)(startOfMonth, endOfMonth) }
            }),
            this.bookings.count({
                where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(startOfYear) }
            }),
            this.bookings.count({ where: { status: booking_entity_1.BookingStatus.PENDING } }),
            this.bookings.count({ where: { status: booking_entity_1.BookingStatus.CONFIRMED } }),
            this.bookings.count({ where: { status: booking_entity_1.BookingStatus.CANCELLED } }),
        ]);
        const [monthlyRevenue, yearlyRevenue, totalRevenue] = await Promise.all([
            this.getRevenueForPeriod(startOfMonth, endOfMonth),
            this.getRevenueForPeriod(startOfYear, endOfMonth),
            this.getTotalRevenue(),
        ]);
        const [totalUsers, monthlyUsers, activeUsers] = await Promise.all([
            this.users.count(),
            this.users.count({ where: { createdAt: (0, typeorm_2.Between)(startOfMonth, endOfMonth) } }),
            this.users.count({ where: { status: user_entity_1.UserStatus.ACTIVE } }),
        ]);
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
    async getRealtimeStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todaySessions = await this.sessions.find({
            where: {
                startTime: (0, typeorm_2.Between)(today, tomorrow),
                isActive: true,
            },
        });
        const sessionIds = todaySessions.map(s => s.id);
        const todayBookings = sessionIds.length > 0
            ? await this.bookings.createQueryBuilder('b')
                .where('b.sessionId IN (:...ids)', { ids: sessionIds })
                .andWhere('b.status IN (:...statuses)', {
                statuses: [booking_entity_1.BookingStatus.CONFIRMED, booking_entity_1.BookingStatus.COMPLETED],
            })
                .getCount()
            : 0;
        const todayRevenue = sessionIds.length > 0
            ? await this.bookings
                .createQueryBuilder('b')
                .select('SUM(b.totalPrice)', 'total')
                .where('b.sessionId IN (:...ids)', { ids: sessionIds })
                .andWhere('b.status IN (:...statuses)', {
                statuses: [booking_entity_1.BookingStatus.CONFIRMED, booking_entity_1.BookingStatus.COMPLETED],
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
    async getMonthlyStats() {
        const stats = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            const [bookings, revenue] = await Promise.all([
                this.bookings.count({
                    where: { createdAt: (0, typeorm_2.Between)(monthStart, monthEnd) }
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
    async getUsers(params) {
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
    async getUserById(id) {
        const user = await this.users.findOne({
            where: { id },
            relations: ['roles'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
        }
        return user;
    }
    async createUser(dto) {
        const existingUser = await this.users.findOne({ where: { email: dto.email } });
        if (existingUser) {
            throw new common_1.BadRequestException('Un utilisateur avec cet email existe déjà');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.users.create({
            ...dto,
            password: hashedPassword,
        });
        const defaultRole = await this.roles.findOne({
            where: { name: dto.roleName || role_entity_1.RoleName.AGENT },
        });
        if (defaultRole) {
            user.roles = [defaultRole];
        }
        return this.users.save(user);
    }
    async updateUserStatus(id, status) {
        const user = await this.getUserById(id);
        user.status = status;
        return this.users.save(user);
    }
    async assignRole(id, roleName, cinemaId) {
        const user = await this.getUserById(id);
        const role = await this.roles.findOne({ where: { name: roleName } });
        if (!role) {
            throw new common_1.NotFoundException(`Rôle ${roleName} non trouvé`);
        }
        user.roles = [role];
        return this.users.save(user);
    }
    async deleteUser(id) {
        const user = await this.getUserById(id);
        user.status = user_entity_1.UserStatus.SUSPENDED;
        await this.users.save(user);
    }
    async getCinemas() {
        return this.cinemas.find({
            relations: ['halls'],
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }
    async getCinemaById(id) {
        const cinema = await this.cinemas.findOne({
            where: { id },
            relations: ['halls', 'halls.seatLayouts'],
        });
        if (!cinema) {
            throw new common_1.NotFoundException(`Cinéma avec l'ID ${id} non trouvé`);
        }
        return cinema;
    }
    async createCinema(dto) {
        const cinema = this.cinemas.create(dto);
        return this.cinemas.save(cinema);
    }
    async updateCinema(id, dto) {
        const cinema = await this.getCinemaById(id);
        Object.assign(cinema, dto);
        return this.cinemas.save(cinema);
    }
    async deleteCinema(id) {
        const cinema = await this.getCinemaById(id);
        cinema.isActive = false;
        await this.cinemas.save(cinema);
    }
    async getHalls(cinemaId) {
        const where = cinemaId ? { cinemaId, isActive: true } : { isActive: true };
        return this.halls.find({
            where,
            relations: ['cinema', 'seatLayouts'],
            order: { name: 'ASC' },
        });
    }
    async getHallById(id) {
        const hall = await this.halls.findOne({
            where: { id },
            relations: ['cinema', 'seatLayouts'],
        });
        if (!hall) {
            throw new common_1.NotFoundException(`Salle avec l'ID ${id} non trouvée`);
        }
        return hall;
    }
    async createHall(dto) {
        const hall = this.halls.create(dto);
        const savedHall = await this.halls.save(hall);
        const seatGrid = {};
        const vipSeats = [];
        const vipRowCount = dto.vipRows || 2;
        for (let row = 0; row < dto.rowCount; row++) {
            const rowLetter = String.fromCharCode(65 + row);
            for (let seat = 1; seat <= dto.seatsPerRow; seat++) {
                const seatId = `${rowLetter}${seat}`;
                const isVip = row >= dto.rowCount - vipRowCount;
                seatGrid[seatId] = { type: isVip ? 'vip' : 'standard', status: 'available' };
                if (isVip)
                    vipSeats.push(seatId);
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
    async updateHall(id, dto) {
        const hall = await this.getHallById(id);
        Object.assign(hall, dto);
        return this.halls.save(hall);
    }
    async deleteHall(id) {
        const hall = await this.getHallById(id);
        hall.isActive = false;
        await this.halls.save(hall);
    }
    async getHallSeatLayout(hallId) {
        const layout = await this.seatLayouts.findOne({ where: { hallId } });
        if (!layout) {
            throw new common_1.NotFoundException(`Disposition non trouvée pour la salle ${hallId}`);
        }
        return layout;
    }
    async updateSeatStatus(hallId, seatId, status) {
        const layout = await this.getHallSeatLayout(hallId);
        if (layout.seatGrid[seatId]) {
            layout.seatGrid[seatId].status = status;
            await this.seatLayouts.save(layout);
        }
        return layout;
    }
    async getMovies(params) {
        const where = {};
        if (params.status === 'now_showing')
            where.isShowing = true;
        if (params.genre)
            where.genres = params.genre;
        return this.movies.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }
    async getMovieById(id) {
        const movie = await this.movies.findOne({
            where: { id },
            relations: ['sessions'],
        });
        if (!movie) {
            throw new common_1.NotFoundException(`Film avec l'ID ${id} non trouvé`);
        }
        return movie;
    }
    async createMovie(dto) {
        const movie = this.movies.create(dto);
        return this.movies.save(movie);
    }
    async updateMovie(id, dto) {
        const movie = await this.getMovieById(id);
        Object.assign(movie, dto);
        return this.movies.save(movie);
    }
    async toggleFeatured(id, featured) {
        const movie = await this.getMovieById(id);
        movie.isFeatured = featured;
        return this.movies.save(movie);
    }
    async updateMovieStatus(id, status) {
        const movie = await this.getMovieById(id);
        movie.isShowing = status === 'now_showing';
        return this.movies.save(movie);
    }
    async deleteMovie(id) {
        const movie = await this.getMovieById(id);
        const sessions = await this.sessions.find({ where: { movieId: id, isActive: true } });
        if (sessions.length > 0) {
            throw new common_1.BadRequestException('Impossible de supprimer un film avec des séances actives');
        }
        await this.movies.remove(movie);
    }
    async getSessions(params) {
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
    async getSessionById(id) {
        const session = await this.sessions.findOne({
            where: { id },
            relations: ['movie', 'hall'],
        });
        if (!session) {
            throw new common_1.NotFoundException(`Séance avec l'ID ${id} non trouvée`);
        }
        return session;
    }
    async deleteSession(id) {
        const session = await this.getSessionById(id);
        session.isActive = false;
        await this.sessions.save(session);
    }
    async getBookings(params) {
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
    async getBookingById(id) {
        const booking = await this.bookings.findOne({
            where: { id },
            relations: ['session', 'session.movie', 'user'],
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
        }
        return booking;
    }
    async updateBookingStatus(id, status) {
        const booking = await this.getBookingById(id);
        booking.status = status;
        if (status === booking_entity_1.BookingStatus.CANCELLED) {
            booking.cancelledAt = new Date();
        }
        return this.bookings.save(booking);
    }
    async refundBooking(id) {
        const booking = await this.getBookingById(id);
        if (booking.status !== booking_entity_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Seules les réservations confirmées peuvent être remboursées');
        }
        booking.status = booking_entity_1.BookingStatus.CANCELLED;
        booking.cancelledAt = new Date();
        const session = await this.getSessionById(booking.sessionId);
        session.availableSeats += booking.ticketCount;
        booking.seats.forEach(seat => {
            if (!session.reservedSeats)
                session.reservedSeats = [];
            session.reservedSeats = session.reservedSeats.filter(s => s !== seat);
        });
        await this.sessions.save(session);
        return this.bookings.save(booking);
    }
    async getSalesReport(startDate, endDate, cinemaId) {
        const queryBuilder = this.bookings.createQueryBuilder('booking')
            .leftJoin('booking.session', 'session')
            .leftJoin('session.hall', 'hall')
            .leftJoin('session.movie', 'movie')
            .where('booking.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate })
            .andWhere('booking.status IN (:...statuses)', {
            statuses: [booking_entity_1.BookingStatus.CONFIRMED, booking_entity_1.BookingStatus.COMPLETED],
        });
        if (cinemaId) {
            queryBuilder.andWhere('hall.cinemaId = :cinemaId', { cinemaId });
        }
        const bookings = await queryBuilder.getMany();
        const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);
        const byPaymentMethod = {};
        const byMovie = {};
        bookings.forEach(b => {
            byPaymentMethod[b.paymentMethod] = (byPaymentMethod[b.paymentMethod] || 0) + Number(b.totalPrice);
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
    async getOccupancyReport() {
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
    async getTopMovies(limit, startDate, endDate) {
        const where = { isShowing: true };
        if (startDate && endDate) {
            where.releaseYear = (0, typeorm_2.Between)(startDate.getFullYear(), endDate.getFullYear());
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
                    statuses: [booking_entity_1.BookingStatus.CONFIRMED, booking_entity_1.BookingStatus.COMPLETED],
                })
                    .getCount()
                : 0;
            const revenue = sessionIds.length > 0
                ? await this.bookings
                    .createQueryBuilder('b')
                    .select('SUM(b.totalPrice)', 'total')
                    .where('b.sessionId IN (:...ids)', { ids: sessionIds })
                    .andWhere('b.status IN (:...statuses)', {
                    statuses: [booking_entity_1.BookingStatus.CONFIRMED, booking_entity_1.BookingStatus.COMPLETED],
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
    async getTopMoviesOld(limit = 5) {
        return this.getTopMovies(limit);
    }
    async getTopUsers(limit = 10) {
        const users = await this.users.find({
            where: { status: user_entity_1.UserStatus.ACTIVE },
            relations: ['roles'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const bookings = await this.bookings.find({
                where: { userId: user.id },
            });
            const confirmedBookings = bookings.filter(b => [booking_entity_1.BookingStatus.CONFIRMED, booking_entity_1.BookingStatus.COMPLETED].includes(b.status));
            const totalSpent = confirmedBookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                totalBookings: bookings.length,
                confirmedBookings: confirmedBookings.length,
                totalSpent,
            };
        }));
        return usersWithStats.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, limit);
    }
    async getRecentBookings(limit = 10) {
        return this.bookings.find({
            relations: ['session', 'session.movie', 'user'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async getPaymentAnalysis() {
        const payments = await this.bookings.find({
            where: {
                status: booking_entity_1.BookingStatus.CONFIRMED,
            },
            select: ['paymentMethod'],
        });
        const analysis = {};
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
    async getPopularSessions(limit = 5) {
        const sessions = await this.sessions.find({
            relations: ['movie'],
            where: { isActive: true },
            order: { availableSeats: 'ASC' },
            take: limit * 3,
        });
        const sessionsWithStats = await Promise.all(sessions.map(async (session) => {
            const totalBooked = await this.bookings.count({
                where: {
                    sessionId: session.id,
                    status: booking_entity_1.BookingStatus.CONFIRMED,
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
        }));
        return sessionsWithStats
            .filter(s => s.bookedSeats > 0)
            .sort((a, b) => b.bookedSeats - a.bookedSeats)
            .slice(0, limit);
    }
    async getRevenueForPeriod(start, end) {
        const result = await this.bookings
            .createQueryBuilder('b')
            .select('SUM(b.totalPrice)', 'total')
            .where('b.createdAt BETWEEN :start AND :end', { start, end })
            .andWhere('b.status IN (:...statuses)', {
            statuses: [booking_entity_1.BookingStatus.CONFIRMED, booking_entity_1.BookingStatus.COMPLETED]
        })
            .getRawOne();
        return Number(result?.total || 0);
    }
    async getTotalRevenue() {
        const result = await this.bookings
            .createQueryBuilder('b')
            .select('SUM(b.totalPrice)', 'total')
            .where('b.status IN (:...statuses)', {
            statuses: [booking_entity_1.BookingStatus.CONFIRMED, booking_entity_1.BookingStatus.COMPLETED]
        })
            .getRawOne();
        return Number(result?.total || 0);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __param(3, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __param(4, (0, typeorm_1.InjectRepository)(cinema_entity_1.Cinema)),
    __param(5, (0, typeorm_1.InjectRepository)(hall_entity_1.Hall)),
    __param(6, (0, typeorm_1.InjectRepository)(seat_layout_entity_1.SeatLayout)),
    __param(7, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map