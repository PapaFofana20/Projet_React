import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { User, UserStatus } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Session } from '../sessions/entities/session.entity';
import { Cinema } from '../cinemas/entities/cinema.entity';
import { Hall } from '../cinemas/entities/hall.entity';
import { SeatLayout } from '../cinemas/entities/seat-layout.entity';
import { Role } from '../auth/entities/role.entity';
export declare class AdminService {
    private bookings;
    private users;
    private movies;
    private sessions;
    private cinemas;
    private halls;
    private seatLayouts;
    private roles;
    constructor(bookings: Repository<Booking>, users: Repository<User>, movies: Repository<Movie>, sessions: Repository<Session>, cinemas: Repository<Cinema>, halls: Repository<Hall>, seatLayouts: Repository<SeatLayout>, roles: Repository<Role>);
    getDashboardStats(): Promise<{
        bookings: {
            total: number;
            thisMonth: number;
            thisYear: number;
            pending: number;
            confirmed: number;
            cancelled: number;
        };
        revenue: {
            total: number;
            thisMonth: number;
            thisYear: number;
            currency: string;
        };
        users: {
            total: number;
            thisMonth: number;
            active: number;
        };
        movies: {
            total: number;
            showing: number;
        };
        sessions: {
            total: number;
            active: number;
        };
        cinemas: {
            total: number;
        };
    }>;
    getRealtimeStats(): Promise<{
        today: {
            sessions: number;
            bookings: number;
            revenue: number;
            availableSeats: number;
            totalSeats: number;
            occupancyRate: number;
        };
        sessions: {
            id: number;
            startTime: Date;
            roomName: string;
            availableSeats: number;
            totalSeats: number;
        }[];
    }>;
    getMonthlyStats(): Promise<{
        month: string;
        monthIndex: number;
        year: number;
        bookings: number;
        revenue: number;
    }[]>;
    getUsers(params: {
        page?: number;
        limit?: number;
        status?: string;
        role?: string;
    }): Promise<{
        data: {
            password: undefined;
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            status: UserStatus;
            avatarUrl: string;
            dateOfBirth: Date | null;
            roles: Role[];
            bookings: Booking[];
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserById(id: number): Promise<User>;
    createUser(dto: any): Promise<User>;
    updateUserStatus(id: number, status: string): Promise<User>;
    assignRole(id: number, roleName: string, cinemaId?: number): Promise<User>;
    deleteUser(id: number): Promise<void>;
    getCinemas(): Promise<Cinema[]>;
    getCinemaById(id: number): Promise<Cinema>;
    createCinema(dto: any): Promise<Cinema>;
    updateCinema(id: number, dto: any): Promise<Cinema>;
    deleteCinema(id: number): Promise<void>;
    getHalls(cinemaId?: number): Promise<Hall[]>;
    getHallById(id: number): Promise<Hall>;
    createHall(dto: any): Promise<Hall>;
    updateHall(id: number, dto: any): Promise<Hall>;
    deleteHall(id: number): Promise<void>;
    getHallSeatLayout(hallId: number): Promise<SeatLayout>;
    updateSeatStatus(hallId: number, seatId: string, status: string): Promise<SeatLayout>;
    getMovies(params: {
        status?: string;
        genre?: string;
    }): Promise<Movie[]>;
    getMovieById(id: number): Promise<Movie>;
    createMovie(dto: any): Promise<Movie>;
    updateMovie(id: number, dto: any): Promise<Movie>;
    toggleFeatured(id: number, featured: boolean): Promise<Movie>;
    updateMovieStatus(id: number, status: string): Promise<Movie>;
    deleteMovie(id: number): Promise<void>;
    getSessions(params: any): Promise<Session[]>;
    getSessionById(id: number): Promise<Session>;
    deleteSession(id: number): Promise<void>;
    getBookings(params: any): Promise<{
        data: Booking[];
        meta: any;
    }>;
    getBookingById(id: number): Promise<Booking>;
    updateBookingStatus(id: number, status: BookingStatus): Promise<Booking>;
    refundBooking(id: number): Promise<Booking>;
    getSalesReport(startDate: Date, endDate: Date, cinemaId?: number): Promise<any>;
    getOccupancyReport(): Promise<any[]>;
    getTopMovies(limit: number, startDate?: Date, endDate?: Date): Promise<any[]>;
    getTopMoviesOld(limit?: number): Promise<any[]>;
    getTopUsers(limit?: number): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        totalBookings: number;
        confirmedBookings: number;
        totalSpent: number;
    }[]>;
    getRecentBookings(limit?: number): Promise<Booking[]>;
    getPaymentAnalysis(): Promise<{
        method: string;
        count: number;
        percentage: number;
    }[]>;
    getPopularSessions(limit?: number): Promise<{
        movie: Movie;
        bookedSeats: number;
        occupancyRate: number;
        totalBooked: number;
        id: number;
        movieId: number;
        hallId: number;
        hall: Hall;
        roomName: string;
        screenType: import("../sessions/entities/session.entity").ScreenType;
        sessionType: import("../sessions/entities/session.entity").SessionType;
        startTime: Date;
        endTime: Date;
        price: number;
        totalSeats: number;
        availableSeats: number;
        reservedSeats: string[];
        isActive: boolean;
        bookings: Booking[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    private getRevenueForPeriod;
    private getTotalRevenue;
}
