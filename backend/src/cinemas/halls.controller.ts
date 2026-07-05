import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HallsService } from './halls.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../auth/entities/role.entity';

@ApiTags('Admin - Salles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Get()
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Liste des salles' })
  async findAll() {
    return this.hallsService.findAll();
  }

  @Get('cinema/:cinemaId')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN, RoleName.AGENT)
  @ApiOperation({ summary: 'Salles par cinéma' })
  async findByCinema(@Param('cinemaId', ParseIntPipe) cinemaId: number) {
    return this.hallsService.findByCinema(cinemaId);
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Détails dune salle' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hallsService.findOne(id);
  }

  @Post()
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Créer une nouvelle salle (avec générationauto de la grille)' })
  async create(@Body() data: any) {
    return this.hallsService.create(data);
  }

  @Put(':id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour une salle' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.hallsService.update(id, data);
  }

  @Delete(':id')
  @Roles(RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer une salle' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.hallsService.remove(id);
    return { message: 'Salle supprimée avec succès' };
  }

  @Get(':id/seats')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN, RoleName.AGENT)
  @ApiOperation({ summary: 'Disposition des sièges dune salle' })
  async getSeatLayout(@Param('id', ParseIntPipe) id: number) {
    return this.hallsService.getSeatLayout(id);
  }

  @Put(':id/seats/:seatId')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour un siège (bloquer/débloquer)' })
  async updateSeat(
    @Param('id', ParseIntPipe) id: number,
    @Param('seatId') seatId: string,
    @Body('status') status: string,
  ) {
    return this.hallsService.updateSeat(id, seatId, status);
  }
}
