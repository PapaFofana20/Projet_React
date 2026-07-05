import { User } from '../../users/entities/user.entity';
import { Session } from '../../sessions/entities/session.entity';
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare enum PaymentMethod {
    CASH = "cash",
    ORANGE_MONEY = "orange_money",
    WAV_MONEY = "wav_money",
    CARD = "card"
}
export declare class Booking {
    id: number;
    bookingCode: string;
    userId: number;
    user: User;
    sessionId: number;
    session: Session;
    status: BookingStatus;
    seats: string[];
    ticketCount: number;
    totalPrice: number;
    paymentMethod: PaymentMethod;
    transactionId: string;
    paymentPhone: string;
    qrCode: string;
    viewerName: string;
    viewerEmail: string;
    createdAt: Date;
    updatedAt: Date;
    cancelledAt: Date;
}
