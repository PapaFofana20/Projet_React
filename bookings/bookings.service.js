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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const sessions_service_1 = require("../sessions/sessions.service");
const users_service_1 = require("../users/users.service");
const QRCode = require("qrcode");
let BookingsService = class BookingsService {
    constructor(bookings, sessions, users) {
        this.bookings = bookings;
        this.sessions = sessions;
        this.users = users;
    }
    async create(dto, userId) {
        const session = await this.sessions.findOne(dto.sessionId);
        if (!session.isActive)
            throw new common_1.BadRequestException('Séance inactive');
        if (session.availableSeats < dto.seats.length) {
            throw new common_1.BadRequestException(`Plus que ${session.availableSeats} places`);
        }
        const reservation = await this.sessions.reserveSeats(session.id, dto.seats);
        if (!reservation.success)
            throw new common_1.BadRequestException('Erreur réservation');
        const code = this.genCode();
        const qrData = await QRCode.toDataURL(JSON.stringify({
            code, sessionId: session.id, movie: session.movie?.title,
            seats: dto.seats, time: session.startTime,
        }));
        const booking = this.bookings.create({
            bookingCode: code,
            userId,
            sessionId: dto.sessionId,
            seats: dto.seats,
            ticketCount: dto.seats.length,
            totalPrice: Number(session.price) * dto.seats.length,
            paymentMethod: dto.paymentMethod,
            paymentPhone: dto.paymentPhone,
            viewerName: dto.viewerName,
            viewerEmail: dto.viewerEmail,
            qrCode: qrData,
            status: booking_entity_1.BookingStatus.CONFIRMED,
        });
        const saved = await this.bookings.save(booking);
        return this.findOne(saved.id);
    }
    findAll(query) {
        const { page = 1, limit = 20, userId, status, bookingCode } = query;
        const qb = this.bookings.createQueryBuilder('b')
            .leftJoinAndSelect('b.session', 's').leftJoinAndSelect('s.movie', 'm')
            .leftJoinAndSelect('b.user', 'u');
        if (userId)
            qb.andWhere('b.userId = :uid', { uid: userId });
        if (status)
            qb.andWhere('b.status = :s', { s: status });
        if (bookingCode)
            qb.andWhere('b.bookingCode = :c', { c: bookingCode });
        return qb.orderBy('b.createdAt', 'DESC').skip((page - 1) * limit).take(limit)
            .getManyAndCount().then(([data, total]) => ({
            data, total, page, limit, pages: Math.ceil(total / limit)
        }));
    }
    async findOne(id) {
        const b = await this.bookings.findOne({
            where: { id },
            relations: ['session', 'session.movie', 'user'],
        });
        if (!b)
            throw new common_1.NotFoundException(`Réservation ${id} non trouvée`);
        return b;
    }
    async findByCode(code) {
        const b = await this.bookings.findOne({
            where: { bookingCode: code },
            relations: ['session', 'session.movie', 'user'],
        });
        if (!b)
            throw new common_1.NotFoundException(`Réservation ${code} non trouvée`);
        return b;
    }
    findByUser(userId) {
        return this.bookings.find({
            where: { userId },
            relations: ['session', 'session.movie'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, dto) {
        const booking = await this.bookings.findOne({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException(`Réservation ${id} non trouvée`);
        if (dto.status === booking_entity_1.BookingStatus.CANCELLED) {
            await this.sessions.releaseSeats(booking.sessionId, booking.seats);
            dto = { ...dto, cancelledAt: new Date() };
        }
        await this.bookings.update(id, dto);
        return this.findOne(id);
    }
    async cancel(id, userId) {
        const booking = await this.findOne(id);
        if (userId && booking.userId !== userId)
            throw new common_1.BadRequestException('Non autorisé');
        if (booking.status === booking_entity_1.BookingStatus.CANCELLED)
            throw new common_1.BadRequestException('Déjà annulée');
        if (booking.status === booking_entity_1.BookingStatus.COMPLETED)
            throw new common_1.BadRequestException('Déjà complétée');
        await this.sessions.releaseSeats(booking.sessionId, booking.seats);
        return this.update(id, { status: booking_entity_1.BookingStatus.CANCELLED, cancelledAt: new Date() });
    }
    confirmPayment(id, transactionId) {
        return this.update(id, { status: booking_entity_1.BookingStatus.CONFIRMED, transactionId });
    }
    complete(id) {
        return this.update(id, { status: booking_entity_1.BookingStatus.COMPLETED });
    }
    stats() {
        return Promise.all([
            this.bookings.count(),
            this.bookings.count({ where: { status: booking_entity_1.BookingStatus.CONFIRMED } }),
            this.bookings.count({ where: { status: booking_entity_1.BookingStatus.CANCELLED } }),
            this.bookings.count({ where: { status: booking_entity_1.BookingStatus.COMPLETED } }),
        ]).then(([total, confirmed, cancelled, completed]) => ({
            total, confirmed, cancelled, completed,
        }));
    }
    async revenue() {
        const result = await this.bookings.createQueryBuilder('b')
            .select('SUM(b.totalPrice)', 'total')
            .where('b.status IN (:...s)', { s: [booking_entity_1.BookingStatus.CONFIRMED, booking_entity_1.BookingStatus.COMPLETED] })
            .getRawOne();
        return { total: Number(result?.total || 0) };
    }
    async userStats(userId) {
        const bookings = await this.findByUser(userId);
        const filter = (s) => bookings.filter(b => b.status === s).length;
        return {
            total: bookings.length,
            spent: bookings.filter(b => [booking_entity_1.BookingStatus.CONFIRMED, booking_entity_1.BookingStatus.COMPLETED].includes(b.status))
                .reduce((sum, b) => sum + Number(b.totalPrice), 0),
            confirmed: filter(booking_entity_1.BookingStatus.CONFIRMED),
            cancelled: filter(booking_entity_1.BookingStatus.CANCELLED),
            completed: filter(booking_entity_1.BookingStatus.COMPLETED),
        };
    }
    genCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'SNF-';
        for (let i = 0; i < 8; i++)
            code += chars[Math.floor(Math.random() * chars.length)];
        return code;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sessions_service_1.SessionsService,
        users_service_1.UsersService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map