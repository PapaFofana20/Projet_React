import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import {
  CreateSessionDto,
  UpdateSessionDto,
  SessionQueryDto,
  ReserveSeatsDto,
} from './dto/session.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../auth/entities/role.entity';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Créer une nouvelle séance (Admin)' })
  @ApiResponse({ status: 201, description: 'Séance créée' })
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtenir toutes les séances' })
  @ApiResponse({ status: 200, description: 'Liste des séances' })
  findAll(@Query() query: SessionQueryDto) {
    return this.sessionsService.findAll(query);
  }

  @Get('movie/:movieId')
  @Public()
  @ApiOperation({ summary: 'Obtenir les séances dun film' })
  @ApiResponse({ status: 200, description: 'Séances du film' })
  findByMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.sessionsService.findByMovie(movieId);
  }

  @Get('date/:date')
  @Public()
  @ApiOperation({ summary: 'Obtenir les séances par date' })
  @ApiResponse({ status: 200, description: 'Séances de la date' })
  findByDate(@Param('date') date: string) {
    return this.sessionsService.findByDate(new Date(date));
  }

  @Get('stats')
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtenir les statistiques des séances (Admin)' })
  @ApiResponse({ status: 200, description: 'Statistiques' })
  getStats() {
    return this.sessionsService.stats();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtenir une séance par ID' })
  @ApiResponse({ status: 200, description: 'Détails de la séance' })
  @ApiResponse({ status: 404, description: 'Séance non trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mettre à jour une séance (Admin)' })
  @ApiResponse({ status: 200, description: 'Séance mise à jour' })
  @ApiResponse({ status: 404, description: 'Séance non trouvée' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Post(':id/reserve-seats')
  @Public()
  @ApiOperation({ summary: 'Réserver des places' })
  @ApiResponse({ status: 200, description: 'Places réservées' })
  @ApiResponse({ status: 400, description: 'Places non disponibles' })
  reserveSeats(
    @Param('id', ParseIntPipe) id: number,
    @Body() reserveSeatsDto: ReserveSeatsDto,
  ) {
    return this.sessionsService.reserveSeats(id, reserveSeatsDto.seats);
  }

  @Post(':id/release-seats')
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Libérer des places (Admin)' })
  @ApiResponse({ status: 200, description: 'Places libérées' })
  releaseSeats(
    @Param('id', ParseIntPipe) id: number,
    @Body() reserveSeatsDto: ReserveSeatsDto,
  ) {
    return this.sessionsService.releaseSeats(id, reserveSeatsDto.seats);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer une séance (Admin)' })
  @ApiResponse({ status: 200, description: 'Séance supprimée' })
  @ApiResponse({ status: 404, description: 'Séance non trouvée' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.remove(id);
  }
}
