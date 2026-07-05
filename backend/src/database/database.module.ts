import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeeder } from './seeds/database.seeder';
import { Role } from '../auth/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Session } from '../sessions/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Movie, Session])],
  providers: [DatabaseSeeder],
})
export class DatabaseModule {}
