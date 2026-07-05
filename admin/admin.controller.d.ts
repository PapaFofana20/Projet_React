import { AdminService } from './admin.service';
import { SessionSchedulingService } from './services/session-scheduling.service';
import { CreateSessionDto, UpdateSessionDto, CreateMovieDto, UpdateMovieDto, CreateUserDto, UpdateUserStatusDto, AssignRoleDto } from './dto/session.dto';
import { CreateCinemaDto, UpdateCinemaDto, CreateHallDto, UpdateHallDto } from './dto/cinema.dto';
import { BookingStatus } from '../bookings/entities/booking.entity';
export declare class AdminController {
    private readonly adminService;
    private readonly sessionSchedulingService;
    constructor(adminService: AdminService, sessionSchedulingService: SessionSchedulingService);
    getDashboard(): Promise<{
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
    getMonthlyStats(): Promise<{
        month: string;
        monthIndex: number;
        year: number;
        bookings: number;
        revenue: number;
    }[]>;
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
    getUsers(page?: number, limit?: number, status?: string, role?: string): Promise<{
        data: {
            password: undefined;
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            status: import("../users/entities/user.entity").UserStatus;
            avatarUrl: string;
            dateOfBirth: Date | null;
            roles: import("../auth/entities/role.entity").Role[];
            bookings: import("../bookings/entities/booking.entity").Booking[];
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
    getUser(id: number): Promise<import("../users/entities/user.entity").User>;
    createUser(dto: CreateUserDto): Promise<import("../users/entities/user.entity").User>;
    updateUserStatus(id: number, dto: UpdateUserStatusDto): Promise<import("../users/entities/user.entity").User>;
    assignRole(id: number, dto: AssignRoleDto): Promise<import("../users/entities/user.entity").User>;
    deleteUser(id: number): Promise<void>;
    getCinemas(): Promise<import("../cinemas/entities/cinema.entity").Cinema[]>;
    getCinema(id: number): Promise<import("../cinemas/entities/cinema.entity").Cinema>;
    createCinema(dto: CreateCinemaDto): Promise<import("../cinemas/entities/cinema.entity").Cinema>;
    updateCinema(id: number, dto: UpdateCinemaDto): Promise<import("../cinemas/entities/cinema.entity").Cinema>;
    deleteCinema(id: number): Promise<void>;
    getHalls(cinemaId?: number): Promise<import("../cinemas/entities/hall.entity").Hall[]>;
    getHall(id: number): Promise<import("../cinemas/entities/hall.entity").Hall>;
    createHall(dto: CreateHallDto): Promise<import("../cinemas/entities/hall.entity").Hall>;
    updateHall(id: number, dto: UpdateHallDto): Promise<import("../cinemas/entities/hall.entity").Hall>;
    deleteHall(id: number): Promise<void>;
    getHallSeats(id: number): Promise<import("../cinemas/entities/seat-layout.entity").SeatLayout>;
    updateSeat(hallId: number, seatId: string, status: string): Promise<import("../cinemas/entities/seat-layout.entity").SeatLayout>;
    getMovies(status?: string, genre?: string): Promise<import("../movies/entities/movie.entity").Movie[]>;
    getMovie(id: number): Promise<import("../movies/entities/movie.entity").Movie>;
    createMovie(dto: CreateMovieDto): Promise<import("../movies/entities/movie.entity").Movie>;
    updateMovie(id: number, dto: UpdateMovieDto): Promise<import("../movies/entities/movie.entity").Movie>;
    toggleFeatured(id: number, featured: boolean): Promise<import("../movies/entities/movie.entity").Movie>;
    updateMovieStatus(id: number, status: string): Promise<import("../movies/entities/movie.entity").Movie>;
    deleteMovie(id: number): Promise<void>;
    getSessions(cinemaId?: number, hallId?: number, movieId?: number, date?: string, status?: string): Promise<import("../sessions/entities/session.entity").Session[]>;
    getSession(id: number): Promise<import("../sessions/entities/session.entity").Session>;
    createSession(dto: CreateSessionDto): Promise<{
        session: import("../sessions/entities/session.entity").Session;
        validation: import("./services/session-scheduling.service").SessionValidationResult;
    }>;
    validateSession(dto: CreateSessionDto): Promise<import("./services/session-scheduling.service").SessionValidationResult>;
    updateSession(id: number, dto: UpdateSessionDto): Promise<import("../sessions/entities/session.entity").Session>;
    deleteSession(id: number): Promise<void>;
    getCinemaCalendar(cinemaId: number, startDate: string, endDate: string): Promise<Map<string, import("../sessions/entities/session.entity").Session[]>>;
    getSessionGaps(hallId: number, startDate: string, endDate: string, minGapMinutes?: number): Promise<{
        start: Date;
        end: Date;
        durationMinutes: number;
    }[]>;
    getBookings(status?: BookingStatus, cinemaId?: number, date?: string, page?: number): Promise<{
        data: import("../bookings/entities/booking.entity").Booking[];
        meta: any;
    }>;
    getBooking(id: number): Promise<import("../bookings/entities/booking.entity").Booking>;
    updateBookingStatus(id: number, status: BookingStatus): Promise<import("../bookings/entities/booking.entity").Booking>;
    refundBooking(id: number): Promise<import("../bookings/entities/booking.entity").Booking>;
    getSalesReport(startDate: string, endDate: string, cinemaId?: number): Promise<any>;
    getOccupancyReport(): Promise<any[]>;
    getTopMovies(limit?: number, startDate?: string, endDate?: string): Promise<any[]>;
}
