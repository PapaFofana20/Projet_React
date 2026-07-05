import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role, RoleName } from '../../auth/entities/role.entity';
import { User, UserStatus } from '../../users/entities/user.entity';
import { Movie, MovieGenre, MovieRating } from '../../movies/entities/movie.entity';
import { Session, SessionType, ScreenType } from '../../sessions/entities/session.entity';

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    this.logger.log('🌱 Début du peuplement de la base de données...');

    await this.seedRoles();
    await this.seedUsers();
    await this.seedMovies();
    await this.seedSessions();

    this.logger.log('✅ Base de données populated avec succès !');
  }

  private async seedRoles() {
    const roles = [
      {
        name: RoleName.ADMIN,
        description: 'Administrateur du système',
      },
      {
        name: RoleName.USER,
        description: 'Utilisateur standard',
      },
    ];

    for (const roleData of roles) {
      const existing = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existing) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
        this.logger.log(`✅ Rôle créé: ${roleData.name}`);
      }
    }
  }

  private async seedUsers() {
    const adminRole = await this.roleRepository.findOne({
      where: { name: RoleName.ADMIN },
    });
    const userRole = await this.roleRepository.findOne({
      where: { name: RoleName.USER },
    });

    const users = [
      {
        firstName: 'Admin',
        lastName: 'SENEFLIX',
        email: 'admin@seneflix.com',
        password: await bcrypt.hash('Admin123!', 10),
        phone: '+221771234567',
        status: UserStatus.ACTIVE,
        roles: adminRole ? [adminRole] : [],
      },
      {
        firstName: 'Moussa',
        lastName: 'Diallo',
        email: 'moussa.diallo@email.com',
        password: await bcrypt.hash('Password123!', 10),
        phone: '+221761234567',
        status: UserStatus.ACTIVE,
        roles: userRole ? [userRole] : [],
      },
      {
        firstName: 'Aminata',
        lastName: 'Sall',
        email: 'aminata.sall@email.com',
        password: await bcrypt.hash('Password123!', 10),
        phone: '+221701234567',
        status: UserStatus.ACTIVE,
        roles: userRole ? [userRole] : [],
      },
    ];

    for (const userData of users) {
      const existing = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existing) {
        const user = this.userRepository.create({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          status: userData.status,
          roles: userData.roles,
        });
        await this.userRepository.save(user);
        this.logger.log(`✅ Utilisateur créé: ${userData.email}`);
      }
    }
  }

  private async seedMovies() {
    const movies = [
      {
        title: 'Oppenheimer',
        synopsis:
          'Lhistoire du scientifique J. Robert Oppenheimer et son rôle dans le développement de la bombe atomique.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        genres: [MovieGenre.DRAMA, MovieGenre.THRILLER],
        duration: 180,
        releaseYear: 2023,
        director: 'Christopher Nolan',
        rating: MovieRating.R,
        cast: 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.',
        language: 'Anglais',
        subtitles: 'Français',
        isShowing: true,
        isFeatured: true,
        averageRating: 8.5,
        voteCount: 15420,
      },
      {
        title: 'Barbie',
        synopsis:
          'Barbie et Ken sammusent beaucoup dans le monde de Barbie, mais récemment, ils ne sont plus satisfaits.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
        genres: [MovieGenre.COMEDY, MovieGenre.ADVENTURE],
        duration: 114,
        releaseYear: 2023,
        director: 'Greta Gerwig',
        rating: MovieRating.PG_13,
        cast: 'Margot Robbie, Ryan Gosling',
        language: 'Anglais',
        subtitles: 'Français',
        isShowing: true,
        isFeatured: true,
        averageRating: 7.2,
        voteCount: 8920,
      },
      {
        title: 'Dune: Deuxième Partie',
        synopsis:
          "Paul Atreides unite avec les Fremen tout en suivant un chemin sombre qui pourrait détruire tout ce qu'il aime.",
        posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        genres: [MovieGenre.SCI_FI, MovieGenre.ADVENTURE],
        duration: 166,
        releaseYear: 2024,
        director: 'Denis Villeneuve',
        rating: MovieRating.PG_13,
        cast: 'Timothée Chalamet, Zendaya, Rebecca Ferguson',
        language: 'Anglais',
        subtitles: 'Français',
        isShowing: true,
        isFeatured: true,
        averageRating: 8.7,
        voteCount: 12350,
      },
      {
        title: 'Spider-Man: Across the Spider-Verse',
        synopsis:
          "Miles Morales plonge dans le multivers et traverse différentes dimensions avec un groupe de Spider-People.",
        posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704Au.jpg',
        genres: [MovieGenre.ACTION, MovieGenre.ANIMATION],
        duration: 140,
        releaseYear: 2023,
        director: 'Joaquim Dos Santos',
        rating: MovieRating.PG,
        cast: 'Shameik Moore, Hailee Steinfeld',
        language: 'Anglais',
        subtitles: 'Français',
        isShowing: true,
        isFeatured: false,
        averageRating: 8.6,
        voteCount: 9840,
      },
      {
        title: 'John Wick 4',
        synopsis:
          'John Wick découvre un chemin pour vaincre la Grande Table. Mais avant de gagner sa liberté, il doit affronter un nouvel ennemi.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
        genres: [MovieGenre.ACTION, MovieGenre.THRILLER],
        duration: 169,
        releaseYear: 2023,
        director: 'Chad Stahelski',
        rating: MovieRating.R,
        cast: 'Keanu Reeves, Donnie Yen, Bill Skarsgård',
        language: 'Anglais',
        subtitles: 'Français',
        isShowing: true,
        isFeatured: false,
        averageRating: 7.9,
        voteCount: 11200,
      },
      {
        title: 'Wonka',
        synopsis:
          "L'histoire des débuts du jeune Willy Wonka et de ses premières victoires contre les chocolatiers rivaux.",
        posterUrl: 'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
        genres: [MovieGenre.COMEDY, MovieGenre.FANTASY],
        duration: 116,
        releaseYear: 2023,
        director: 'Paul King',
        rating: MovieRating.PG,
        cast: 'Timothée Chalamet, Calah Lane, Keegan-Michael Key',
        language: 'Anglais',
        subtitles: 'Français',
        isShowing: true,
        isFeatured: true,
        averageRating: 7.4,
        voteCount: 7680,
      },
      {
        title: 'Napoleon',
        synopsis:
          "Un aperçu de la vie personnelle et de la carrière militaire de Napoléon Bonaparte.",
        posterUrl: 'https://image.tmdb.org/t/p/w500/jE5o7y9K6pZtWNNMEwtWm8xXXnR.jpg',
        genres: [MovieGenre.DRAMA, MovieGenre.THRILLER],
        duration: 158,
        releaseYear: 2023,
        director: 'Ridley Scott',
        rating: MovieRating.R,
        cast: 'Joaquin Phoenix, Vanessa Kirby',
        language: 'Anglais',
        subtitles: 'Français',
        isShowing: true,
        isFeatured: false,
        averageRating: 7.1,
        voteCount: 6540,
      },
      {
        title: 'Aquaman et le Royaume Perdu',
        synopsis:
          "Aquaman doit protéger Atlantis et le monde entier d'une menace imminente.",
        posterUrl: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TQ0b3H8yEX.jpg',
        genres: [MovieGenre.ACTION, MovieGenre.ADVENTURE],
        duration: 123,
        releaseYear: 2023,
        director: 'James Wan',
        rating: MovieRating.PG_13,
        cast: 'Jason Momoa, Amber Heard, Willem Dafoe',
        language: 'Anglais',
        subtitles: 'Français',
        isShowing: false,
        isFeatured: false,
        averageRating: 6.8,
        voteCount: 5430,
      },
    ];

    for (const movieData of movies) {
      const existing = await this.movieRepository.findOne({
        where: { title: movieData.title },
      });

      if (!existing) {
        const movie = this.movieRepository.create(movieData);
        await this.movieRepository.save(movie);
        this.logger.log(`✅ Film créé: ${movieData.title}`);
      }
    }
  }

  private async seedSessions() {
    const movies = await this.movieRepository.find({ where: { isShowing: true } });

    const today = new Date();
    const sessionTypes = [SessionType.STANDARD, SessionType.THREE_D, SessionType.VIP];
    const rooms = ['Salle A', 'Salle B', 'Salle C', 'Salle VIP'];

    for (const movie of movies) {
      for (let day = 0; day < 7; day++) {
        const sessionDate = new Date(today);
        sessionDate.setDate(today.getDate() + day);

        const times = ['10:00', '13:30', '16:00', '19:00', '21:30'];

        for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
          const time = times[Math.floor(Math.random() * times.length)];
          const [hours, minutes] = time.split(':').map(Number);

          const startTime = new Date(sessionDate);
          startTime.setHours(hours, minutes, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + movie.duration);

          const sessionType =
            sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
          const room = rooms[Math.floor(Math.random() * rooms.length)];

          const basePrice = 2500;
          const priceModifier =
            sessionType === SessionType.VIP
              ? 1.5
              : sessionType === SessionType.THREE_D
                ? 1.2
                : 1;

          const existingSession = await this.sessionRepository.findOne({
            where: {
              movieId: movie.id,
              startTime,
              roomName: room,
            },
          });

          if (!existingSession) {
            const session = this.sessionRepository.create({
              movieId: movie.id,
              roomName: room,
              screenType:
                room === 'Salle VIP' ? ScreenType.SMALL : ScreenType.REGULAR,
              sessionType,
              startTime,
              endTime,
              price: Math.round(basePrice * priceModifier),
              totalSeats: room === 'Salle VIP' ? 50 : 100,
              availableSeats: room === 'Salle VIP' ? 50 : 100,
              reservedSeats: [],
              isActive: true,
            });

            await this.sessionRepository.save(session);
          }
        }
      }
    }

    this.logger.log('✅ Séances créées pour les 7 prochains jours');
  }
}
