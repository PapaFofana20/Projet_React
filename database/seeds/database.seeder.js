"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const role_entity_1 = require("../../auth/entities/role.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const movie_entity_1 = require("../../movies/entities/movie.entity");
const session_entity_1 = require("../../sessions/entities/session.entity");
let DatabaseSeeder = DatabaseSeeder_1 = class DatabaseSeeder {
    constructor(roleRepository, userRepository, movieRepository, sessionRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.sessionRepository = sessionRepository;
        this.logger = new common_1.Logger(DatabaseSeeder_1.name);
    }
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
    async seedRoles() {
        const roles = [
            {
                name: role_entity_1.RoleName.ADMIN,
                description: 'Administrateur du système',
            },
            {
                name: role_entity_1.RoleName.USER,
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
    async seedUsers() {
        const adminRole = await this.roleRepository.findOne({
            where: { name: role_entity_1.RoleName.ADMIN },
        });
        const userRole = await this.roleRepository.findOne({
            where: { name: role_entity_1.RoleName.USER },
        });
        const users = [
            {
                firstName: 'Admin',
                lastName: 'SENEFLIX',
                email: 'admin@seneflix.com',
                password: await bcrypt.hash('Admin123!', 10),
                phone: '+221771234567',
                status: user_entity_1.UserStatus.ACTIVE,
                roles: adminRole ? [adminRole] : [],
            },
            {
                firstName: 'Moussa',
                lastName: 'Diallo',
                email: 'moussa.diallo@email.com',
                password: await bcrypt.hash('Password123!', 10),
                phone: '+221761234567',
                status: user_entity_1.UserStatus.ACTIVE,
                roles: userRole ? [userRole] : [],
            },
            {
                firstName: 'Aminata',
                lastName: 'Sall',
                email: 'aminata.sall@email.com',
                password: await bcrypt.hash('Password123!', 10),
                phone: '+221701234567',
                status: user_entity_1.UserStatus.ACTIVE,
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
    async seedMovies() {
        const movies = [
            {
                title: 'Oppenheimer',
                synopsis: 'Lhistoire du scientifique J. Robert Oppenheimer et son rôle dans le développement de la bombe atomique.',
                posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
                genres: [movie_entity_1.MovieGenre.DRAMA, movie_entity_1.MovieGenre.THRILLER],
                duration: 180,
                releaseYear: 2023,
                director: 'Christopher Nolan',
                rating: movie_entity_1.MovieRating.R,
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
                synopsis: 'Barbie et Ken sammusent beaucoup dans le monde de Barbie, mais récemment, ils ne sont plus satisfaits.',
                posterUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
                genres: [movie_entity_1.MovieGenre.COMEDY, movie_entity_1.MovieGenre.ADVENTURE],
                duration: 114,
                releaseYear: 2023,
                director: 'Greta Gerwig',
                rating: movie_entity_1.MovieRating.PG_13,
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
                synopsis: "Paul Atreides unite avec les Fremen tout en suivant un chemin sombre qui pourrait détruire tout ce qu'il aime.",
                posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
                genres: [movie_entity_1.MovieGenre.SCI_FI, movie_entity_1.MovieGenre.ADVENTURE],
                duration: 166,
                releaseYear: 2024,
                director: 'Denis Villeneuve',
                rating: movie_entity_1.MovieRating.PG_13,
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
                synopsis: "Miles Morales plonge dans le multivers et traverse différentes dimensions avec un groupe de Spider-People.",
                posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704Au.jpg',
                genres: [movie_entity_1.MovieGenre.ACTION, movie_entity_1.MovieGenre.ANIMATION],
                duration: 140,
                releaseYear: 2023,
                director: 'Joaquim Dos Santos',
                rating: movie_entity_1.MovieRating.PG,
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
                synopsis: 'John Wick découvre un chemin pour vaincre la Grande Table. Mais avant de gagner sa liberté, il doit affronter un nouvel ennemi.',
                posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
                genres: [movie_entity_1.MovieGenre.ACTION, movie_entity_1.MovieGenre.THRILLER],
                duration: 169,
                releaseYear: 2023,
                director: 'Chad Stahelski',
                rating: movie_entity_1.MovieRating.R,
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
                synopsis: "L'histoire des débuts du jeune Willy Wonka et de ses premières victoires contre les chocolatiers rivaux.",
                posterUrl: 'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
                genres: [movie_entity_1.MovieGenre.COMEDY, movie_entity_1.MovieGenre.FANTASY],
                duration: 116,
                releaseYear: 2023,
                director: 'Paul King',
                rating: movie_entity_1.MovieRating.PG,
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
                synopsis: "Un aperçu de la vie personnelle et de la carrière militaire de Napoléon Bonaparte.",
                posterUrl: 'https://image.tmdb.org/t/p/w500/jE5o7y9K6pZtWNNMEwtWm8xXXnR.jpg',
                genres: [movie_entity_1.MovieGenre.DRAMA, movie_entity_1.MovieGenre.THRILLER],
                duration: 158,
                releaseYear: 2023,
                director: 'Ridley Scott',
                rating: movie_entity_1.MovieRating.R,
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
                synopsis: "Aquaman doit protéger Atlantis et le monde entier d'une menace imminente.",
                posterUrl: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TQ0b3H8yEX.jpg',
                genres: [movie_entity_1.MovieGenre.ACTION, movie_entity_1.MovieGenre.ADVENTURE],
                duration: 123,
                releaseYear: 2023,
                director: 'James Wan',
                rating: movie_entity_1.MovieRating.PG_13,
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
    async seedSessions() {
        const movies = await this.movieRepository.find({ where: { isShowing: true } });
        const today = new Date();
        const sessionTypes = [session_entity_1.SessionType.STANDARD, session_entity_1.SessionType.THREE_D, session_entity_1.SessionType.VIP];
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
                    const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
                    const room = rooms[Math.floor(Math.random() * rooms.length)];
                    const basePrice = 2500;
                    const priceModifier = sessionType === session_entity_1.SessionType.VIP
                        ? 1.5
                        : sessionType === session_entity_1.SessionType.THREE_D
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
                            screenType: room === 'Salle VIP' ? session_entity_1.ScreenType.SMALL : session_entity_1.ScreenType.REGULAR,
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
};
exports.DatabaseSeeder = DatabaseSeeder;
exports.DatabaseSeeder = DatabaseSeeder = DatabaseSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __param(3, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DatabaseSeeder);
//# sourceMappingURL=database.seeder.js.map