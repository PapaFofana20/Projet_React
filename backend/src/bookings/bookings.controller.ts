import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  BookingQueryDto,
  CancelBookingDto,
} from './dto/booking.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../auth/entities/role.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Créer une nouvelle réservation' })
  @ApiResponse({ status: 201, description: 'Réservation créée' })
  @ApiResponse({ status: 400, description: 'Places non disponibles' })
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.create(createBookingDto, user.id);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtenir toutes les réservations (Admin)' })
  @ApiResponse({ status: 200, description: 'Liste des réservations' })
  findAll(@Query() query: BookingQueryDto) {
    return this.bookingsService.findAll(query);
  }

  @Get('my-bookings')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtenir mes réservations' })
  @ApiResponse({ status: 200, description: 'Mes réservations' })
  getMyBookings(@CurrentUser() user: User) {
    return this.bookingsService.findByUser(user.id);
  }

  @Get('my-stats')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtenir mes statistiques de réservation' })
  @ApiResponse({ status: 200, description: 'Mes statistiques' })
  getMyStats(@CurrentUser() user: User) {
    return this.bookingsService.userStats(user.id);
  }

  @Get('stats')
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtenir les statistiques des réservations (Admin)' })
  @ApiResponse({ status: 200, description: 'Statistiques' })
  getStats() {
    return this.bookingsService.stats();
  }

  @Get('code/:code')
  @Public()
  @ApiOperation({ summary: 'Obtenir une réservation par code' })
  @ApiResponse({ status: 200, description: 'Détails de la réservation' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée' })
  findByCode(@Param('code') code: string) {
    return this.bookingsService.findByCode(code);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtenir une réservation par ID' })
  @ApiResponse({ status: 200, description: 'Détails de la réservation' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mettre à jour une réservation (Admin)' })
  @ApiResponse({ status: 200, description: 'Réservation mise à jour' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Post(':id/cancel')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation annulée' })
  @ApiResponse({ status: 400, description: 'Annulation impossible' })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() cancelDto: CancelBookingDto,
  ) {
    return this.bookingsService.cancel(id, user.id);
  }

  @Post(':id/confirm-payment')
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmer le paiement (Admin)' })
  @ApiResponse({ status: 200, description: 'Paiement confirmé' })
  confirmPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body('transactionId') transactionId: string,
  ) {
    return this.bookingsService.confirmPayment(id, transactionId);
  }

  @Post(':id/complete')
  @Roles(RoleName.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marquer comme complétée (Admin)' })
  @ApiResponse({ status: 200, description: 'Réservation complétée' })
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.complete(id);
  }
}
