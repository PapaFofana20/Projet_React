import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cinema } from './entities/cinema.entity';
import { Hall } from './entities/hall.entity';
import { SeatLayout } from './entities/seat-layout.entity';
import { CinemasController } from './cinemas.controller';
import { CinemasService } from './cinemas.service';
import { HallsController } from './halls.controller';
import { HallsService } from './halls.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cinema, Hall, SeatLayout])],
  controllers: [CinemasController, HallsController],
  providers: [CinemasService, HallsService],
  exports: [TypeOrmModule],
})
export class CinemasModule {}
