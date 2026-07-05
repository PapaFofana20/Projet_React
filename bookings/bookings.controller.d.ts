import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, BookingQueryDto, CancelBookingDto } from './dto/booking.dto';
import { User } from '../users/entities/user.entity';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, user: User): Promise<import("./entities/booking.entity").Booking>;
    findAll(query: BookingQueryDto): Promise<{
        data: import("./entities/booking.entity").Booking[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getMyBookings(user: User): Promise<import("./entities/booking.entity").Booking[]>;
    getMyStats(user: User): Promise<{
        total: number;
        spent: number;
        confirmed: number;
        cancelled: number;
        completed: number;
    }>;
    getStats(): Promise<{
        total: number;
        confirmed: number;
        cancelled: number;
        completed: number;
    }>;
    findByCode(code: string): Promise<import("./entities/booking.entity").Booking>;
    findOne(id: number): Promise<import("./entities/booking.entity").Booking>;
    update(id: number, updateBookingDto: UpdateBookingDto): Promise<import("./entities/booking.entity").Booking>;
    cancel(id: number, user: User, cancelDto: CancelBookingDto): Promise<import("./entities/booking.entity").Booking>;
    confirmPayment(id: number, transactionId: string): Promise<import("./entities/booking.entity").Booking>;
    complete(id: number): Promise<import("./entities/booking.entity").Booking>;
}
