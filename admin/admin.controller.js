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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const session_scheduling_service_1 = require("./services/session-scheduling.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_entity_1 = require("../auth/entities/role.entity");
const session_dto_1 = require("./dto/session.dto");
const cinema_dto_1 = require("./dto/cinema.dto");
const booking_entity_1 = require("../bookings/entities/booking.entity");
let AdminController = class AdminController {
    constructor(adminService, sessionSchedulingService) {
        this.adminService = adminService;
        this.sessionSchedulingService = sessionSchedulingService;
    }
    async getDashboard() {
        return this.adminService.getDashboardStats();
    }
    async getMonthlyStats() {
        return this.adminService.getMonthlyStats();
    }
    async getRealtimeStats() {
        return this.adminService.getRealtimeStats();
    }
    async getUsers(page, limit, status, role) {
        return this.adminService.getUsers({ page, limit, status, role });
    }
    async getUser(id) {
        return this.adminService.getUserById(id);
    }
    async createUser(dto) {
        return this.adminService.createUser(dto);
    }
    async updateUserStatus(id, dto) {
        return this.adminService.updateUserStatus(id, dto.status);
    }
    async assignRole(id, dto) {
        return this.adminService.assignRole(id, dto.roleName, dto.cinemaId);
    }
    async deleteUser(id) {
        await this.adminService.deleteUser(id);
    }
    async getCinemas() {
        return this.adminService.getCinemas();
    }
    async getCinema(id) {
        return this.adminService.getCinemaById(id);
    }
    async createCinema(dto) {
        return this.adminService.createCinema(dto);
    }
    async updateCinema(id, dto) {
        return this.adminService.updateCinema(id, dto);
    }
    async deleteCinema(id) {
        await this.adminService.deleteCinema(id);
    }
    async getHalls(cinemaId) {
        return this.adminService.getHalls(cinemaId);
    }
    async getHall(id) {
        return this.adminService.getHallById(id);
    }
    async createHall(dto) {
        return this.adminService.createHall(dto);
    }
    async updateHall(id, dto) {
        return this.adminService.updateHall(id, dto);
    }
    async deleteHall(id) {
        await this.adminService.deleteHall(id);
    }
    async getHallSeats(id) {
        return this.adminService.getHallSeatLayout(id);
    }
    async updateSeat(hallId, seatId, status) {
        return this.adminService.updateSeatStatus(hallId, seatId, status);
    }
    async getMovies(status, genre) {
        return this.adminService.getMovies({ status, genre });
    }
    async getMovie(id) {
        return this.adminService.getMovieById(id);
    }
    async createMovie(dto) {
        return this.adminService.createMovie(dto);
    }
    async updateMovie(id, dto) {
        return this.adminService.updateMovie(id, dto);
    }
    async toggleFeatured(id, featured) {
        return this.adminService.toggleFeatured(id, featured);
    }
    async updateMovieStatus(id, status) {
        return this.adminService.updateMovieStatus(id, status);
    }
    async deleteMovie(id) {
        await this.adminService.deleteMovie(id);
    }
    async getSessions(cinemaId, hallId, movieId, date, status) {
        return this.adminService.getSessions({ cinemaId, hallId, movieId, date, status });
    }
    async getSession(id) {
        return this.adminService.getSessionById(id);
    }
    async createSession(dto) {
        return this.sessionSchedulingService.createSession(dto);
    }
    async validateSession(dto) {
        const startTime = new Date(dto.startTime);
        const movie = await this.adminService.getMovieById(dto.movieId);
        const durationMinutes = movie.duration + 20;
        const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
        return this.sessionSchedulingService.validateSession(dto.hallId, startTime, endTime);
    }
    async updateSession(id, dto) {
        return this.sessionSchedulingService.updateSession(id, dto);
    }
    async deleteSession(id) {
        await this.adminService.deleteSession(id);
    }
    async getCinemaCalendar(cinemaId, startDate, endDate) {
        return this.sessionSchedulingService.getCinemaCalendar(cinemaId, new Date(startDate), new Date(endDate));
    }
    async getSessionGaps(hallId, startDate, endDate, minGapMinutes) {
        return this.sessionSchedulingService.findGaps(hallId, new Date(startDate), new Date(endDate), minGapMinutes || 30);
    }
    async getBookings(status, cinemaId, date, page) {
        return this.adminService.getBookings({ status, cinemaId, date, page });
    }
    async getBooking(id) {
        return this.adminService.getBookingById(id);
    }
    async updateBookingStatus(id, status) {
        return this.adminService.updateBookingStatus(id, status);
    }
    async refundBooking(id) {
        return this.adminService.refundBooking(id);
    }
    async getSalesReport(startDate, endDate, cinemaId) {
        return this.adminService.getSalesReport(new Date(startDate), new Date(endDate), cinemaId);
    }
    async getOccupancyReport() {
        return this.adminService.getOccupancyReport();
    }
    async getTopMovies(limit, startDate, endDate) {
        return this.adminService.getTopMovies(limit || 10, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Tableau de bord principal - Statistiques globales' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Données du tableau de bord' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('stats/monthly'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques mensuelles (12 derniers mois)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMonthlyStats", null);
__decorate([
    (0, common_1.Get)('stats/realtime'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques en temps réel (occupations, revenus)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRealtimeStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Liste de tous les utilisateurs' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'role', required: false, type: String }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Détails dun utilisateur' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUser", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouvel utilisateur (admin/agent)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('users/:id/status'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, roles_decorator_1.MinRoleLevel)(role_entity_1.RoleLevel.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le statut dun utilisateur (active/inactive/suspended)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, session_dto_1.UpdateUserStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Put)('users/:id/roles'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Assigner/modifier les rôles dun utilisateur' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, session_dto_1.AssignRoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignRole", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un utilisateur (soft delete)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('cinemas'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des cinémas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCinemas", null);
__decorate([
    (0, common_1.Get)('cinemas/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Détails dun cinéma avec ses salles' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCinema", null);
__decorate([
    (0, common_1.Post)('cinemas'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau cinéma' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cinema_dto_1.CreateCinemaDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCinema", null);
__decorate([
    (0, common_1.Put)('cinemas/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un cinéma' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, cinema_dto_1.UpdateCinemaDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCinema", null);
__decorate([
    (0, common_1.Delete)('cinemas/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un cinéma (soft delete)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCinema", null);
__decorate([
    (0, common_1.Get)('halls'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des salles' }),
    (0, swagger_1.ApiQuery)({ name: 'cinemaId', required: false, type: Number }),
    __param(0, (0, common_1.Query)('cinemaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getHalls", null);
__decorate([
    (0, common_1.Get)('halls/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Détails dune salle avec sa disposition de sièges' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getHall", null);
__decorate([
    (0, common_1.Post)('halls'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle salle (génération auto de la grille)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cinema_dto_1.CreateHallDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createHall", null);
__decorate([
    (0, common_1.Put)('halls/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une salle' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, cinema_dto_1.UpdateHallDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateHall", null);
__decorate([
    (0, common_1.Delete)('halls/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une salle (soft delete)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteHall", null);
__decorate([
    (0, common_1.Get)('halls/:id/seats'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN, role_entity_1.RoleName.AGENT),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir la disposition des sièges dune salle' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getHallSeats", null);
__decorate([
    (0, common_1.Put)('halls/:id/seats/:seatId'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Bloquer/débloquer un siège' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('seatId')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSeat", null);
__decorate([
    (0, common_1.Get)('movies'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN, role_entity_1.RoleName.AGENT),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des films' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: "now_showing|upcoming|archive" }),
    (0, swagger_1.ApiQuery)({ name: 'genre', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('genre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMovies", null);
__decorate([
    (0, common_1.Get)('movies/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN, role_entity_1.RoleName.AGENT),
    (0, swagger_1.ApiOperation)({ summary: 'Détails dun film avec ses séances' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMovie", null);
__decorate([
    (0, common_1.Post)('movies'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un nouveau film au catalogue' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_dto_1.CreateMovieDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createMovie", null);
__decorate([
    (0, common_1.Put)('movies/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un film' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, session_dto_1.UpdateMovieDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateMovie", null);
__decorate([
    (0, common_1.Put)('movies/:id/featured'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Définir/retirer un film en avant' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('featured')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleFeatured", null);
__decorate([
    (0, common_1.Put)('movies/:id/status'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Changer le statut dun film (à laffiche, prochainnement, archive)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateMovieStatus", null);
__decorate([
    (0, common_1.Delete)('movies/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un film (avec confirmation de labsence de séances)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteMovie", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN, role_entity_1.RoleName.AGENT),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des séances' }),
    (0, swagger_1.ApiQuery)({ name: 'cinemaId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'hallId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'movieId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false, description: 'Format: YYYY-MM-DD' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    __param(0, (0, common_1.Query)('cinemaId')),
    __param(1, (0, common_1.Query)('hallId')),
    __param(2, (0, common_1.Query)('movieId')),
    __param(3, (0, common_1.Query)('date')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)('sessions/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN, role_entity_1.RoleName.AGENT),
    (0, swagger_1.ApiOperation)({ summary: 'Détails dune séance' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)('sessions'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Créer une nouvelle séance',
        description: 'Le calcul automatique de lheure de fin se fait ainsi: Date_Heure_Fin = Date_Heure_Debut + Durée_du_film + 20 min de nettoyage',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Séance créée avec succès. Retourne la séance et les informations de validation.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflit détecté avec une séance existante',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_dto_1.CreateSessionDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createSession", null);
__decorate([
    (0, common_1.Post)('sessions/validate'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Valider une séance sans la créer (prévisualisation)',
        description: 'Permet de vérifier les conflits et le calcul de lheure de fin avant création',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_dto_1.CreateSessionDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "validateSession", null);
__decorate([
    (0, common_1.Put)('sessions/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier une séance (recalcule automatiquement si changement dhoraire)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, session_dto_1.UpdateSessionDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSession", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Annuler/supprimer une séance' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteSession", null);
__decorate([
    (0, common_1.Get)('sessions/calendar/:cinemaId'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Calendrier complet dun cinéma' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, description: 'Format: YYYY-MM-DD' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, description: 'Format: YYYY-MM-DD' }),
    __param(0, (0, common_1.Param)('cinemaId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCinemaCalendar", null);
__decorate([
    (0, common_1.Get)('sessions/gaps/:hallId'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Trouver les créneaux disponibles dans une salle' }),
    __param(0, (0, common_1.Param)('hallId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('minGap')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSessionGaps", null);
__decorate([
    (0, common_1.Get)('bookings'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN, role_entity_1.RoleName.AGENT),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des réservations' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: booking_entity_1.BookingStatus }),
    (0, swagger_1.ApiQuery)({ name: 'cinemaId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('cinemaId')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)('bookings/:id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN, role_entity_1.RoleName.AGENT),
    (0, swagger_1.ApiOperation)({ summary: 'Détails dune réservation' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBooking", null);
__decorate([
    (0, common_1.Put)('bookings/:id/status'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier le statut dune réservation' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.Post)('bookings/:id/refund'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Effectuer un remboursement' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "refundBooking", null);
__decorate([
    (0, common_1.Get)('reports/sales'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Rapport des ventes' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'cinemaId', required: false }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('cinemaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSalesReport", null);
__decorate([
    (0, common_1.Get)('reports/occupancy'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Rapport du taux doccupation par salle' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOccupancyReport", null);
__decorate([
    (0, common_1.Get)('reports/top-movies'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Top films les plus populaires' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTopMovies", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Administration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        session_scheduling_service_1.SessionSchedulingService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map