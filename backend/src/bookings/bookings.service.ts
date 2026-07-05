import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';
import { CreateBookingDto, UpdateBookingDto, BookingQueryDto } from './dto/booking.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookings: Repository<Booking>,
    private sessions: SessionsService,
    private users: UsersService,
  ) {}

  // ========== CRÉER ==========
  async create(dto: CreateBookingDto, userId: number) {
    const session = await this.sessions.findOne(dto.sessionId);

    // Vérifications
    if (!session.isActive) throw new BadRequestException('Séance inactive');
    if (session.availableSeats < dto.seats.length) {
      throw new BadRequestException(`Plus que ${session.availableSeats} places`);
    }

    // Réserver les places
    const reservation = await this.sessions.reserveSeats(session.id, dto.seats);
    if (!reservation.success) throw new BadRequestException('Erreur réservation');

    // Générer le code et QR
    const code = this.genCode();
    const qrData = await QRCode.toDataURL(JSON.stringify({
      code, sessionId: session.id, movie: session.movie?.title,
      seats: dto.seats, time: session.startTime,
    }));

    // Sauvegarder
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
      status: BookingStatus.CONFIRMED,
    });

    const saved = await this.bookings.save(booking);
    return this.findOne(saved.id);
  }

  // ========== LISTE ==========
  findAll(query: BookingQueryDto) {
    const { page = 1, limit = 20, userId, status, bookingCode } = query;
    const qb = this.bookings.createQueryBuilder('b')
      .leftJoinAndSelect('b.session', 's').leftJoinAndSelect('s.movie', 'm')
      .leftJoinAndSelect('b.user', 'u');

    if (userId) qb.andWhere('b.userId = :uid', { uid: userId });
    if (status) qb.andWhere('b.status = :s', { s: status });
    if (bookingCode) qb.andWhere('b.bookingCode = :c', { c: bookingCode });

    return qb.orderBy('b.createdAt', 'DESC').skip((page - 1) * limit).take(limit)
      .getManyAndCount().then(([data, total]) => ({
        data, total, page, limit, pages: Math.ceil(total / limit)
      }));
  }

  // ========== UN SEUL ==========
  async findOne(id: number) {
    const b = await this.bookings.findOne({
      where: { id },
      relations: ['session', 'session.movie', 'user'],
    });
    if (!b) throw new NotFoundException(`Réservation ${id} non trouvée`);
    return b;
  }

  async findByCode(code: string) {
    const b = await this.bookings.findOne({
      where: { bookingCode: code },
      relations: ['session', 'session.movie', 'user'],
    });
    if (!b) throw new NotFoundException(`Réservation ${code} non trouvée`);
    return b;
  }

  // ========== PAR UTILISATEUR ==========
  findByUser(userId: number) {
    return this.bookings.find({
      where: { userId },
      relations: ['session', 'session.movie'],
      order: { createdAt: 'DESC' },
    });
  }

  // ========== MODIFIER ==========
  async update(id: number, dto: UpdateBookingDto) {
    const booking = await this.bookings.findOne({ where: { id } });
    if (!booking) throw new NotFoundException(`Réservation ${id} non trouvée`);

    if (dto.status === BookingStatus.CANCELLED) {
      await this.sessions.releaseSeats(booking.sessionId, booking.seats);
      dto = { ...dto, cancelledAt: new Date() } as any;
    }

    await this.bookings.update(id, dto);
    return this.findOne(id);
  }

  // ========== ANNULER ==========
  async cancel(id: number, userId?: number) {
    const booking = await this.findOne(id);

    if (userId && booking.userId !== userId) throw new BadRequestException('Non autorisé');
    if (booking.status === BookingStatus.CANCELLED) throw new BadRequestException('Déjà annulée');
    if (booking.status === BookingStatus.COMPLETED) throw new BadRequestException('Déjà complétée');

    await this.sessions.releaseSeats(booking.sessionId, booking.seats);
    return this.update(id, { status: BookingStatus.CANCELLED, cancelledAt: new Date() } as any);
  }

  // ========== PAIEMENT ==========
  confirmPayment(id: number, transactionId: string) {
    return this.update(id, { status: BookingStatus.CONFIRMED, transactionId });
  }

  complete(id: number) {
    return this.update(id, { status: BookingStatus.COMPLETED });
  }

  // ========== STATS ==========
  stats() {
    return Promise.all([
      this.bookings.count(),
      this.bookings.count({ where: { status: BookingStatus.CONFIRMED } }),
      this.bookings.count({ where: { status: BookingStatus.CANCELLED } }),
      this.bookings.count({ where: { status: BookingStatus.COMPLETED } }),
    ]).then(([total, confirmed, cancelled, completed]) => ({
      total, confirmed, cancelled, completed,
    }));
  }

  async revenue() {
    const result = await this.bookings.createQueryBuilder('b')
      .select('SUM(b.totalPrice)', 'total')
      .where('b.status IN (:...s)', { s: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] })
      .getRawOne();
    return { total: Number(result?.total || 0) };
  }

  async userStats(userId: number) {
    const bookings = await this.findByUser(userId);
    const filter = (s: BookingStatus) => bookings.filter(b => b.status === s).length;
    return {
      total: bookings.length,
      spent: bookings.filter(b => [BookingStatus.CONFIRMED, BookingStatus.COMPLETED].includes(b.status))
        .reduce((sum, b) => sum + Number(b.totalPrice), 0),
      confirmed: filter(BookingStatus.CONFIRMED),
      cancelled: filter(BookingStatus.CANCELLED),
      completed: filter(BookingStatus.COMPLETED),
    };
  }

  // ========== PRIVÉ ==========
  private genCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SNF-';
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  }
}
