import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SessionSchedulingService } from './services/session-scheduling.service';
import { Booking } from '../bookings/entities/booking.entity';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Session } from '../sessions/entities/session.entity';
import { Cinema } from '../cinemas/entities/cinema.entity';
import { Hall } from '../cinemas/entities/hall.entity';
import { SeatLayout } from '../cinemas/entities/seat-layout.entity';
import { Role } from '../auth/entities/role.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      User,
      Movie,
      Session,
      Cinema,
      Hall,
      SeatLayout,
      Role,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, SessionSchedulingService, JwtAuthGuard, RolesGuard],
  exports: [AdminService, SessionSchedulingService],
})
export class AdminModule {}
