import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { SessionSchedulingService } from './services/session-scheduling.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, MinRoleLevel, Permission, RequirePermissions } from '../common/decorators/roles.decorator';
import { RoleName, RoleLevel } from '../auth/entities/role.entity';
import { CreateSessionDto, UpdateSessionDto, CreateMovieDto, UpdateMovieDto, CreateUserDto, UpdateUserStatusDto, AssignRoleDto } from './dto/session.dto';
import { CreateCinemaDto, UpdateCinemaDto, CreateHallDto, UpdateHallDto } from './dto/cinema.dto';
import { BookingStatus } from '../bookings/entities/booking.entity';

@ApiTags('Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly sessionSchedulingService: SessionSchedulingService,
  ) {}

  // ============================================
  // DASHBOARD & STATISTIQUES
  // ============================================

  @Get('dashboard')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Tableau de bord principal - Statistiques globales' })
  @ApiResponse({ status: 200, description: 'Données du tableau de bord' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('stats/monthly')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Statistiques mensuelles (12 derniers mois)' })
  async getMonthlyStats() {
    return this.adminService.getMonthlyStats();
  }

  @Get('stats/realtime')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Statistiques en temps réel (occupations, revenus)' })
  async getRealtimeStats() {
    return this.adminService.getRealtimeStats();
  }

  // ============================================
  // GESTION DES UTILISATEURS
  // ============================================

  @Get('users')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Liste de tous les utilisateurs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers({ page, limit, status, role });
  }

  @Get('users/:id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Détails dun utilisateur' })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUserById(id);
  }

  @Post('users')
  @Roles(RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Créer un nouvel utilisateur (admin/agent)' })
  async createUser(@Body() dto: CreateUserDto) {
    return this.adminService.createUser(dto);
  }

  @Put('users/:id/status')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @MinRoleLevel(RoleLevel.ADMIN)
  @ApiOperation({ summary: 'Mettre à jour le statut dun utilisateur (active/inactive/suspended)' })
  async updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, dto.status);
  }

  @Put('users/:id/roles')
  @Roles(RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Assigner/modifier les rôles dun utilisateur' })
  async assignRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignRoleDto,
  ) {
    return this.adminService.assignRole(id, dto.roleName, dto.cinemaId);
  }

  @Delete('users/:id')
  @Roles(RoleName.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un utilisateur (soft delete)' })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteUser(id);
  }

  // ============================================
  // GESTION DES CINÉMAS
  // ============================================

  @Get('cinemas')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Liste des cinémas' })
  async getCinemas() {
    return this.adminService.getCinemas();
  }

  @Get('cinemas/:id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Détails dun cinéma avec ses salles' })
  async getCinema(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getCinemaById(id);
  }

  @Post('cinemas')
  @Roles(RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Créer un nouveau cinéma' })
  async createCinema(@Body() dto: CreateCinemaDto) {
    return this.adminService.createCinema(dto);
  }

  @Put('cinemas/:id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour un cinéma' })
  async updateCinema(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCinemaDto,
  ) {
    return this.adminService.updateCinema(id, dto);
  }

  @Delete('cinemas/:id')
  @Roles(RoleName.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un cinéma (soft delete)' })
  async deleteCinema(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteCinema(id);
  }

  // ============================================
  // GESTION DES SALLES
  // ============================================

  @Get('halls')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Liste des salles' })
  @ApiQuery({ name: 'cinemaId', required: false, type: Number })
  async getHalls(@Query('cinemaId') cinemaId?: number) {
    return this.adminService.getHalls(cinemaId);
  }

  @Get('halls/:id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Détails dune salle avec sa disposition de sièges' })
  async getHall(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getHallById(id);
  }

  @Post('halls')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Créer une nouvelle salle (génération auto de la grille)' })
  async createHall(@Body() dto: CreateHallDto) {
    return this.adminService.createHall(dto);
  }

  @Put('halls/:id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour une salle' })
  async updateHall(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHallDto,
  ) {
    return this.adminService.updateHall(id, dto);
  }

  @Delete('halls/:id')
  @Roles(RoleName.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une salle (soft delete)' })
  async deleteHall(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteHall(id);
  }

  @Get('halls/:id/seats')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN, RoleName.AGENT)
  @ApiOperation({ summary: 'Obtenir la disposition des sièges dune salle' })
  async getHallSeats(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getHallSeatLayout(id);
  }

  @Put('halls/:id/seats/:seatId')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Bloquer/débloquer un siège' })
  async updateSeat(
    @Param('id', ParseIntPipe) hallId: number,
    @Param('seatId') seatId: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateSeatStatus(hallId, seatId, status);
  }

  // ============================================
  // GESTION DES FILMS
  // ============================================

  @Get('movies')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN, RoleName.AGENT)
  @ApiOperation({ summary: 'Liste des films' })
  @ApiQuery({ name: 'status', required: false, description: "now_showing|upcoming|archive" })
  @ApiQuery({ name: 'genre', required: false })
  async getMovies(
    @Query('status') status?: string,
    @Query('genre') genre?: string,
  ) {
    return this.adminService.getMovies({ status, genre });
  }

  @Get('movies/:id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN, RoleName.AGENT)
  @ApiOperation({ summary: 'Détails dun film avec ses séances' })
  async getMovie(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getMovieById(id);
  }

  @Post('movies')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Ajouter un nouveau film au catalogue' })
  async createMovie(@Body() dto: CreateMovieDto) {
    return this.adminService.createMovie(dto);
  }

  @Put('movies/:id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour un film' })
  async updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.adminService.updateMovie(id, dto);
  }

  @Put('movies/:id/featured')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Définir/retirer un film en avant' })
  async toggleFeatured(
    @Param('id', ParseIntPipe) id: number,
    @Body('featured') featured: boolean,
  ) {
    return this.adminService.toggleFeatured(id, featured);
  }

  @Put('movies/:id/status')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Changer le statut dun film (à laffiche, prochainnement, archive)' })
  async updateMovieStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.adminService.updateMovieStatus(id, status);
  }

  @Delete('movies/:id')
  @Roles(RoleName.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un film (avec confirmation de labsence de séances)' })
  async deleteMovie(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteMovie(id);
  }

  // ============================================
  // GESTION DES SÉANCES (avec planning automatique)
  // ============================================

  @Get('sessions')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN, RoleName.AGENT)
  @ApiOperation({ summary: 'Liste des séances' })
  @ApiQuery({ name: 'cinemaId', required: false, type: Number })
  @ApiQuery({ name: 'hallId', required: false, type: Number })
  @ApiQuery({ name: 'movieId', required: false, type: Number })
  @ApiQuery({ name: 'date', required: false, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'status', required: false })
  async getSessions(
    @Query('cinemaId') cinemaId?: number,
    @Query('hallId') hallId?: number,
    @Query('movieId') movieId?: number,
    @Query('date') date?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getSessions({ cinemaId, hallId, movieId, date, status });
  }

  @Get('sessions/:id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN, RoleName.AGENT)
  @ApiOperation({ summary: 'Détails dune séance' })
  async getSession(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getSessionById(id);
  }

  @Post('sessions')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Créer une nouvelle séance',
    description:
      'Le calcul automatique de lheure de fin se fait ainsi: Date_Heure_Fin = Date_Heure_Debut + Durée_du_film + 20 min de nettoyage',
  })
  @ApiResponse({
    status: 201,
    description:
      'Séance créée avec succès. Retourne la séance et les informations de validation.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflit détecté avec une séance existante',
  })
  async createSession(@Body() dto: CreateSessionDto) {
    return this.sessionSchedulingService.createSession(dto);
  }

  @Post('sessions/validate')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Valider une séance sans la créer (prévisualisation)',
    description: 'Permet de vérifier les conflits et le calcul de lheure de fin avant création',
  })
  async validateSession(@Body() dto: CreateSessionDto) {
    const startTime = new Date(dto.startTime);
    const movie = await this.adminService.getMovieById(dto.movieId);
    const durationMinutes = movie.duration + 20; // 20 min de nettoyage
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    return this.sessionSchedulingService.validateSession(
      dto.hallId,
      startTime,
      endTime,
    );
  }

  @Put('sessions/:id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Modifier une séance (recalcule automatiquement si changement dhoraire)' })
  async updateSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.sessionSchedulingService.updateSession(id, dto);
  }

  @Delete('sessions/:id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Annuler/supprimer une séance' })
  async deleteSession(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteSession(id);
  }

  @Get('sessions/calendar/:cinemaId')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Calendrier complet dun cinéma' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Format: YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Format: YYYY-MM-DD' })
  async getCinemaCalendar(
    @Param('cinemaId', ParseIntPipe) cinemaId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.sessionSchedulingService.getCinemaCalendar(
      cinemaId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('sessions/gaps/:hallId')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Trouver les créneaux disponibles dans une salle' })
  async getSessionGaps(
    @Param('hallId', ParseIntPipe) hallId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('minGap') minGapMinutes?: number,
  ) {
    return this.sessionSchedulingService.findGaps(
      hallId,
      new Date(startDate),
      new Date(endDate),
      minGapMinutes || 30,
    );
  }

  // ============================================
  // GESTION DES RÉSERVATIONS
  // ============================================

  @Get('bookings')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN, RoleName.AGENT)
  @ApiOperation({ summary: 'Liste des réservations' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  @ApiQuery({ name: 'cinemaId', required: false, type: Number })
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async getBookings(
    @Query('status') status?: BookingStatus,
    @Query('cinemaId') cinemaId?: number,
    @Query('date') date?: string,
    @Query('page') page?: number,
  ) {
    return this.adminService.getBookings({ status, cinemaId, date, page });
  }

  @Get('bookings/:id')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN, RoleName.AGENT)
  @ApiOperation({ summary: 'Détails dune réservation' })
  async getBooking(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getBookingById(id);
  }

  @Put('bookings/:id/status')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Modifier le statut dune réservation' })
  async updateBookingStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: BookingStatus,
  ) {
    return this.adminService.updateBookingStatus(id, status);
  }

  @Post('bookings/:id/refund')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Effectuer un remboursement' })
  async refundBooking(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.refundBooking(id);
  }

  // ============================================
  // RAPPORTS & EXPORTS
  // ============================================

  @Get('reports/sales')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Rapport des ventes' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'cinemaId', required: false })
  async getSalesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('cinemaId') cinemaId?: number,
  ) {
    return this.adminService.getSalesReport(
      new Date(startDate),
      new Date(endDate),
      cinemaId,
    );
  }

  @Get('reports/occupancy')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Rapport du taux doccupation par salle' })
  async getOccupancyReport() {
    return this.adminService.getOccupancyReport();
  }

  @Get('reports/top-movies')
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Top films les plus populaires' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getTopMovies(
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getTopMovies(
      limit || 10,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}
