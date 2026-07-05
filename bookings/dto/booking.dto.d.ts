import { BookingStatus, PaymentMethod } from '../entities/booking.entity';
export declare class CreateBookingDto {
    sessionId: number;
    seats: string[];
    paymentMethod: PaymentMethod;
    paymentPhone: string;
    viewerName?: string;
    viewerEmail?: string;
}
export declare class UpdateBookingDto {
    status?: BookingStatus;
    transactionId?: string;
}
export declare class BookingQueryDto {
    page?: number;
    limit?: number;
    userId?: number;
    status?: BookingStatus;
    bookingCode?: string;
}
export declare class CancelBookingDto {
    reason?: string;
}
