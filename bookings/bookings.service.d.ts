import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';
import { CreateBookingDto, UpdateBookingDto, BookingQueryDto } from './dto/booking.dto';
export declare class BookingsService {
    private bookings;
    private sessions;
    private users;
    constructor(bookings: Repository<Booking>, sessions: SessionsService, users: UsersService);
    create(dto: CreateBookingDto, userId: number): Promise<Booking>;
    findAll(query: BookingQueryDto): Promise<{
        data: Booking[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: number): Promise<Booking>;
    findByCode(code: string): Promise<Booking>;
    findByUser(userId: number): Promise<Booking[]>;
    update(id: number, dto: UpdateBookingDto): Promise<Booking>;
    cancel(id: number, userId?: number): Promise<Booking>;
    confirmPayment(id: number, transactionId: string): Promise<Booking>;
    complete(id: number): Promise<Booking>;
    stats(): Promise<{
        total: number;
        confirmed: number;
        cancelled: number;
        completed: number;
    }>;
    revenue(): Promise<{
        total: number;
    }>;
    userStats(userId: number): Promise<{
        total: number;
        spent: number;
        confirmed: number;
        cancelled: number;
        completed: number;
    }>;
    private genCode;
}
