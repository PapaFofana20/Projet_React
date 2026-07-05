import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from './bookings.service';
import { Booking, BookingStatus, PaymentMethod } from './entities/booking.entity';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookingsService - Tests Unitaires', () => {
  let service: BookingsService;
  let bookingsRepository: Repository<Booking>;
  let sessionsService: SessionsService;
  let usersService: UsersService;

  // Mock du repository
  const mockBookingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  // Mock du SessionsService
  const mockSessionsService = {
    findOne: jest.fn(),
    reserveSeats: jest.fn(),
    releaseSeats: jest.fn(),
  };

  // Mock du UsersService
  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: SessionsService,
          useValue: mockSessionsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingsRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    sessionsService = module.get<SessionsService>(SessionsService);
    usersService = module.get<UsersService>(UsersService);

    // Reset mocks avant chaque test
    jest.clearAllMocks();
  });

  describe('Création de réservation', () => {
    const mockSession = {
      id: 1,
      price: 5000,
      availableSeats: 20,
      isActive: true,
      movie: { title: 'Test Movie' },
    };

    const mockUser = { id: 1, email: 'test@test.com' };

    const createBookingDto = {
      sessionId: 1,
      seats: ['A1', 'A2'],
      paymentMethod: PaymentMethod.ORANGE_MONEY,
      paymentPhone: '+221771234567',
    };

    it('devrait créer une réservation avec succès', async () => {
      mockSessionsService.findOne.mockResolvedValue(mockSession);
      mockSessionsService.reserveSeats.mockResolvedValue({ success: true });
      
      const mockBooking = {
        id: 1,
        bookingCode: 'SNF-TESTCODE',
        userId: 1,
        sessionId: 1,
        seats: ['A1', 'A2'],
        ticketCount: 2,
        totalPrice: 10000,
        paymentMethod: PaymentMethod.ORANGE_MONEY,
        status: BookingStatus.CONFIRMED,
      };

      mockBookingRepository.create.mockReturnValue(mockBooking);
      mockBookingRepository.save.mockResolvedValue(mockBooking);
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      const result = await service.create(createBookingDto, 1);

      expect(mockSessionsService.findOne).toHaveBeenCalledWith(1);
      expect(mockSessionsService.reserveSeats).toHaveBeenCalledWith(1, ['A1', 'A2']);
      expect(result).toEqual(mockBooking);
    });

    it('devrait rejeter si la séance est inactive', async () => {
      mockSessionsService.findOne.mockResolvedValue({ ...mockSession, isActive: false });

      await expect(service.create(createBookingDto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait rejeter si pas assez de places disponibles', async () => {
      mockSessionsService.findOne.mockResolvedValue({ ...mockSession, availableSeats: 1 });

      await expect(service.create(createBookingDto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait rejeter si la réservation de places échoue', async () => {
      mockSessionsService.findOne.mockResolvedValue(mockSession);
      mockSessionsService.reserveSeats.mockResolvedValue({ success: false });

      await expect(service.create(createBookingDto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Confirmation de paiement', () => {
    it('devrait confirmer le paiement avec transactionId', async () => {
      const mockBooking = {
        id: 1,
        status: BookingStatus.CONFIRMED,
        transactionId: 'TXN-123456',
      };

      mockBookingRepository.findOne.mockResolvedValue(mockBooking);
      mockBookingRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.confirmPayment(1, 'TXN-123456');

      expect(mockBookingRepository.update).toHaveBeenCalledWith(1, {
        status: BookingStatus.CONFIRMED,
        transactionId: 'TXN-123456',
      });
    });

    it('devrait lancer une erreur si la réservation nest pas trouvée', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(service.confirmPayment(999, 'TXN-123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Annulation de réservation', () => {
    const mockBooking = {
      id: 1,
      userId: 1,
      sessionId: 1,
      seats: ['A1', 'A2'],
      status: BookingStatus.CONFIRMED,
    };

    it('devrait annuler une réservation', async () => {
      // Mock qui retourne différentes valeurs pour chaque appel à findOne
      mockBookingRepository.findOne
        .mockResolvedValueOnce(mockBooking) // Premier appel (dans cancel)
        .mockResolvedValueOnce({ ...mockBooking, status: BookingStatus.CONFIRMED }) // Appel dans update
        .mockResolvedValueOnce({ ...mockBooking, status: BookingStatus.CANCELLED }); // Retour final
      mockSessionsService.releaseSeats.mockResolvedValue({ success: true });
      mockBookingRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.cancel(1, 1);

      expect(mockSessionsService.releaseSeats).toHaveBeenCalledWith(1, ['A1', 'A2']);
      expect(mockBookingRepository.update).toHaveBeenCalled();
    });

    it('devrait rejeter si lutilisateur nest pas le propriétaire', async () => {
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      await expect(service.cancel(1, 999)).rejects.toThrow(BadRequestException);
    });

    it('devrait rejeter si la réservation est déjà annulée', async () => {
      mockBookingRepository.findOne.mockResolvedValue({
        ...mockBooking,
        status: BookingStatus.CANCELLED,
      });

      await expect(service.cancel(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('devrait rejeter si la réservation est déjà complétée', async () => {
      mockBookingRepository.findOne.mockResolvedValue({
        ...mockBooking,
        status: BookingStatus.COMPLETED,
      });

      await expect(service.cancel(1, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('Statistiques', () => {
    it('devrait retourner les statistiques globales', async () => {
      mockBookingRepository.count.mockImplementation((filter) => {
        if (!filter) return Promise.resolve(100);
        if (filter.where?.status === BookingStatus.CONFIRMED) return Promise.resolve(80);
        if (filter.where?.status === BookingStatus.CANCELLED) return Promise.resolve(15);
        if (filter.where?.status === BookingStatus.COMPLETED) return Promise.resolve(5);
        return Promise.resolve(100);
      });

      const result = await service.stats();

      expect(result).toEqual({
        total: 100,
        confirmed: 80,
        cancelled: 15,
        completed: 5,
      });
    });

    it('devrait calculer les revenus totaux', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '250000' }),
      };
      mockBookingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.revenue();

      expect(result).toEqual({ total: 250000 });
    });

    it('devrait retourner les statistiques dun utilisateur', async () => {
      const mockBookings = [
        { status: BookingStatus.CONFIRMED, totalPrice: 10000 },
        { status: BookingStatus.CONFIRMED, totalPrice: 15000 },
        { status: BookingStatus.CANCELLED, totalPrice: 5000 },
        { status: BookingStatus.COMPLETED, totalPrice: 8000 },
      ];

      mockBookingRepository.find.mockResolvedValue(mockBookings);

      const result = await service.userStats(1);

      expect(result).toEqual({
        total: 4,
        spent: 33000, // 10000 + 15000 + 8000 (completed)
        confirmed: 2,
        cancelled: 1,
        completed: 1,
      });
    });
  });

  describe('Recherche de réservations', () => {
    it('devrait trouver une réservation par ID', async () => {
      const mockBooking = { id: 1, bookingCode: 'SNF-TEST' };
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      const result = await service.findOne(1);

      expect(result).toEqual(mockBooking);
    });

    it('devrait lancer une erreur si non trouvée', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('devrait trouver une réservation par code', async () => {
      const mockBooking = { id: 1, bookingCode: 'SNF-TEST123' };
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      const result = await service.findByCode('SNF-TEST123');

      expect(result).toEqual(mockBooking);
    });

    it('devrait retourner toutes les réservations dun utilisateur', async () => {
      const mockBookings = [
        { id: 1, userId: 1 },
        { id: 2, userId: 1 },
      ];
      mockBookingRepository.find.mockResolvedValue(mockBookings);

      const result = await service.findByUser(1);

      expect(result).toEqual(mockBookings);
      expect(mockBookingRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['session', 'session.movie'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('Marquer comme complété', () => {
    it('devrait marquer une réservation comme complétée', async () => {
      const mockBooking = { id: 1, status: BookingStatus.CONFIRMED };
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);
      mockBookingRepository.update.mockResolvedValue({ affected: 1 });
      mockBookingRepository.findOne.mockResolvedValue({
        ...mockBooking,
        status: BookingStatus.COMPLETED,
      });

      const result = await service.complete(1);

      expect(mockBookingRepository.update).toHaveBeenCalledWith(1, {
        status: BookingStatus.COMPLETED,
      });
    });
  });
});
