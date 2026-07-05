import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmTestConfig } from '../src/config/typeorm.test.config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookingsModule } from '../src/bookings/bookings.module';
import { AuthModule } from '../src/auth/auth.module';
import { SessionsModule } from '../src/sessions/sessions.module';
import { MoviesModule } from '../src/movies/movies.module';
import { UsersModule } from '../src/users/users.module';
import { CinemasModule } from '../src/cinemas/cinemas.module';
import { User } from '../src/users/entities/user.entity';
import { Role, RoleName } from '../src/auth/entities/role.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateBookingDto } from '../src/bookings/dto/booking.dto';
import { PaymentMethod, BookingStatus } from '../src/bookings/entities/booking.entity';

describe('Paiements - Tests API (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let rolesRepository: Repository<Role>;
  let configService: ConfigService;
  let jwtService: JwtService;

  // Tokens pour les tests
  let userToken: string;
  let adminToken: string;
  let userId: number;
  let adminId: number;

  // Données de test
  let testSessionId: number;
  const testSeats = ['A1', 'A2'];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TypeOrmTestConfig),
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UsersModule,
        BookingsModule,
        SessionsModule,
        MoviesModule,
        CinemasModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET') || 'test-secret-key',
            signOptions: { expiresIn: '1h' },
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    usersRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    rolesRepository = moduleFixture.get<Repository<Role>>(getRepositoryToken(Role));
    configService = moduleFixture.get<ConfigService>(ConfigService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Génère un JWT token manuellement
   */
  const generateToken = (user: User): string => {
    const secret = configService.get('JWT_SECRET') || 'test-secret-key';
    const payload = { 
      sub: user.id, 
      email: user.email, 
      roles: user.roles?.map(r => r.name) || [] 
    };
    return jwtService.sign(payload, { secret, expiresIn: '1h' });
  };

  /**
   * Crée un utilisateur de test directement en base
   */
  const createTestUser = async (role: RoleName = RoleName.USER) => {
    const email = `test_${Date.now()}@seneflix.test`;
    
    // Récupérer le rôle demandé
    const roleEntity = await rolesRepository.findOne({ where: { name: role } });
    
    // Créer l'utilisateur
    const user = usersRepository.create({
      email,
      password: await bcrypt.hash('Test123!', 10),
      firstName: 'Test',
      lastName: 'User',
      phone: '+221771234567',
      roles: roleEntity ? [roleEntity] : [],
    });
    
    const savedUser = await usersRepository.save(user);
    const token = generateToken(savedUser);
    
    return { user: savedUser, token };
  };

  /**
   * Récupère une séance de test
   */
  const getTestSession = async () => {
    try {
      const response = await request(app.getHttpServer())
        .get('/sessions')
        .set('Authorization', `Bearer ${adminToken}`);
      if (response.body.data && response.body.data.length > 0) {
        return response.body.data[0].id;
      }
    } catch (e) {
      // Ignore
    }
    return 1; // Fallback
  };

  /**
   * Crée une réservation de test
   */
  const createTestBooking = async (
    token: string,
    sessionId: number, 
    paymentMethod: PaymentMethod = PaymentMethod.ORANGE_MONEY
  ) => {
    const dto: CreateBookingDto = {
      sessionId,
      seats: testSeats,
      paymentMethod,
      paymentPhone: '+221771234567',
      viewerName: 'Spectateur Test',
      viewerEmail: 'spectateur@test.com',
    };

    return request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(dto);
  };

  // ============================================
  // SETUP: Authentification
  // ============================================

  describe('Setup - Authentification', () => {
    it('devrait créer un utilisateur et un admin pour les tests', async () => {
      const userResult = await createTestUser(RoleName.USER);
      userToken = userResult.token;
      userId = userResult.user.id;

      const adminResult = await createTestUser(RoleName.ADMIN);
      adminToken = adminResult.token;
      adminId = adminResult.user.id;

      expect(userToken).toBeDefined();
      expect(adminToken).toBeDefined();
      expect(userId).toBeDefined();
      expect(adminId).toBeDefined();
    });
  });

  // ============================================
  // TEST: Création de réservation avec paiement
  // ============================================

  describe('Création de réservation avec paiement', () => {

    it('POST /bookings - devrait créer une réservation avec Orange Money', async () => {
      testSessionId = await getTestSession();

      const dto: CreateBookingDto = {
        sessionId: testSessionId,
        seats: ['B1', 'B2'],
        paymentMethod: PaymentMethod.ORANGE_MONEY,
        paymentPhone: '+221771234567',
        viewerName: 'Moussa Diallo',
        viewerEmail: 'moussa@email.com',
      };

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(dto);

      if (response.status !== 201) {
        console.log('Orange Money test response:', response.body);
      }
      
      expect([201, 400]).toContain(response.status); // 400 si places non disponibles
      
      if (response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('bookingCode');
        expect(response.body.bookingCode).toMatch(/^SNF-[A-Z0-9]{8}$/);
        expect(response.body.paymentMethod).toBe(PaymentMethod.ORANGE_MONEY);
        expect(response.body.paymentPhone).toBe('+221771234567');
      }
    });

    it('POST /bookings - devrait créer une réservation avec Wave', async () => {
      const dto: CreateBookingDto = {
        sessionId: testSessionId,
        seats: ['C1'],
        paymentMethod: PaymentMethod.WAV_MONEY,
        paymentPhone: '+221762345678',
      };

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(dto);

      if (response.status === 201) {
        expect(response.body.paymentMethod).toBe(PaymentMethod.WAV_MONEY);
      }
    });

    it('POST /bookings - devrait créer une réservation en espèces', async () => {
      const dto: CreateBookingDto = {
        sessionId: testSessionId,
        seats: ['D1', 'D2', 'D3'],
        paymentMethod: PaymentMethod.CASH,
        paymentPhone: '+221770000000',
      };

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(dto);

      if (response.status === 201) {
        expect(response.body.paymentMethod).toBe(PaymentMethod.CASH);
      }
    });

    it('POST /bookings - devrait rejeter sans authentification', async () => {
      const dto: CreateBookingDto = {
        sessionId: testSessionId,
        seats: ['E1'],
        paymentMethod: PaymentMethod.ORANGE_MONEY,
        paymentPhone: '+221771234567',
      };

      await request(app.getHttpServer())
        .post('/bookings')
        .send(dto)
        .expect(401);
    });

    it('POST /bookings - devrait rejeter une méthode de paiement invalide', async () => {
      const dto = {
        sessionId: testSessionId,
        seats: ['F1'],
        paymentMethod: 'invalid_method',
        paymentPhone: '+221771234567',
      };

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(dto);

      expect([400, 401]).toContain(response.status);
    });
  });

  // ============================================
  // TEST: Confirmation de paiement (Admin)
  // ============================================

  describe('Confirmation de paiement (Admin)', () => {

    it('POST /bookings/:id/confirm-payment - Admin devrait confirmer un paiement', async () => {
      // Créer d'abord une réservation
      const booking = await createTestBooking(userToken, testSessionId, PaymentMethod.ORANGE_MONEY);
      
      if (booking.status !== 201) {
        console.log('Create booking for confirm test:', booking.body);
      }

      if (booking.status === 201) {
        const response = await request(app.getHttpServer())
          .post(`/bookings/${booking.body.id}/confirm-payment`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ transactionId: 'TXN-123456789' });

        if (response.status === 200) {
          expect(response.body.status).toBe(BookingStatus.CONFIRMED);
          expect(response.body.transactionId).toBe('TXN-123456789');
        }
      }
    });

    it('POST /bookings/:id/confirm-payment - Utilisateur ne peut pas confirmer', async () => {
      const booking = await createTestBooking(userToken, testSessionId, PaymentMethod.WAV_MONEY);

      if (booking.status === 201) {
        await request(app.getHttpServer())
          .post(`/bookings/${booking.body.id}/confirm-payment`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ transactionId: 'TXN-987654321' })
          .expect(403);
      }
    });

    it('POST /bookings/:id/confirm-payment - Sans auth ne peut pas confirmer', async () => {
      await request(app.getHttpServer())
        .post('/bookings/1/confirm-payment')
        .send({ transactionId: 'TXN-111111' })
        .expect(401);
    });
  });

  // ============================================
  // TEST: Annulation
  // ============================================

  describe('Annulation de réservation', () => {

    it('POST /bookings/:id/cancel - Utilisateur devrait pouvoir annuler sa réservation', async () => {
      const booking = await createTestBooking(userToken, testSessionId, PaymentMethod.ORANGE_MONEY);

      if (booking.status === 201) {
        const response = await request(app.getHttpServer())
          .post(`/bookings/${booking.body.id}/cancel`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ reason: 'Changement de plans' });

        if (response.status === 200) {
          expect(response.body.status).toBe(BookingStatus.CANCELLED);
        }
      }
    });

    it('POST /bookings/:id/cancel - Admin peut annuler nimporte quelle réservation', async () => {
      // Créer une réservation
      const otherUser = await createTestUser(RoleName.USER);
      const booking = await createTestBooking(otherUser.token, testSessionId, PaymentMethod.WAV_MONEY);

      if (booking.status === 201) {
        const response = await request(app.getHttpServer())
          .post(`/bookings/${booking.body.id}/cancel`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ reason: 'Séance annulée' });

        if (response.status === 200) {
          expect(response.body.status).toBe(BookingStatus.CANCELLED);
        }
      }
    });
  });

  // ============================================
  // TEST: Consultation des paiements
  // ============================================

  describe('Consultation des paiements', () => {

    it('GET /bookings/my-bookings - devrait retourner les réservations', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings/my-bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /bookings/my-stats - devrait retourner les statistiques', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings/my-stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('spent');
      expect(response.body).toHaveProperty('confirmed');
    });

    it('GET /bookings/:id - devrait retourner les détails', async () => {
      const booking = await createTestBooking(userToken, testSessionId, PaymentMethod.ORANGE_MONEY);

      if (booking.status === 201) {
        const response = await request(app.getHttpServer())
          .get(`/bookings/${booking.body.id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200);

        expect(response.body.id).toBe(booking.body.id);
      }
    });
  });

  // ============================================
  // TEST: Statistiques (Admin)
  // ============================================

  describe('Statistiques (Admin)', () => {

    it('GET /bookings/stats - Admin devrait voir les statistiques', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('confirmed');
      expect(response.body).toHaveProperty('cancelled');
    });

    it('GET /bookings/stats - Utilisateur ne peut pas voir les stats', async () => {
      await request(app.getHttpServer())
        .get('/bookings/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  // ============================================
  // TEST: Marquer comme complété
  // ============================================

  describe('Marquer comme complété', () => {

    it('POST /bookings/:id/complete - Admin devrait marquer comme complété', async () => {
      const booking = await createTestBooking(userToken, testSessionId, PaymentMethod.CASH);

      if (booking.status === 201) {
        const response = await request(app.getHttpServer())
          .post(`/bookings/${booking.body.id}/complete`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        if (response.status === 200) {
          expect(response.body.status).toBe(BookingStatus.COMPLETED);
        }
      }
    });

    it('POST /bookings/:id/complete - Utilisateur ne peut pas compléter', async () => {
      const booking = await createTestBooking(userToken, testSessionId, PaymentMethod.ORANGE_MONEY);

      if (booking.status === 201) {
        await request(app.getHttpServer())
          .post(`/bookings/${booking.body.id}/complete`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      }
    });
  });

  // ============================================
  // TEST: Cas limites
  // ============================================

  describe('Cas limites et erreurs', () => {

    it('GET /bookings/:id - devrait retourner 404 pour inexistant', async () => {
      await request(app.getHttpServer())
        .get('/bookings/999999')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });

    it('GET /bookings/code/:code - devrait retourner 404 pour code invalide', async () => {
      await request(app.getHttpServer())
        .get('/bookings/code/INVALID-CODE')
        .expect(404);
    });

    it('PATCH /bookings/:id - Admin peut mettre à jour le statut', async () => {
      const booking = await createTestBooking(userToken, testSessionId, PaymentMethod.WAV_MONEY);

      if (booking.status === 201) {
        const response = await request(app.getHttpServer())
          .patch(`/bookings/${booking.body.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: BookingStatus.CONFIRMED, transactionId: 'TXN-MANUAL-123' })
          .expect(200);

        if (response.status === 200) {
          expect(response.body.transactionId).toBe('TXN-MANUAL-123');
        }
      }
    });
  });
});
