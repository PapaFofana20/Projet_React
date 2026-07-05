import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Session } from '../../sessions/entities/session.entity';
export declare class DatabaseSeeder implements OnModuleInit {
    private roleRepository;
    private userRepository;
    private movieRepository;
    private sessionRepository;
    private readonly logger;
    constructor(roleRepository: Repository<Role>, userRepository: Repository<User>, movieRepository: Repository<Movie>, sessionRepository: Repository<Session>);
    onModuleInit(): Promise<void>;
    seed(): Promise<void>;
    private seedRoles;
    private seedUsers;
    private seedMovies;
    private seedSessions;
}
