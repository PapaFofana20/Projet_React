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
exports.SessionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sessions_service_1 = require("./sessions.service");
const session_dto_1 = require("./dto/session.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_entity_1 = require("../auth/entities/role.entity");
let SessionsController = class SessionsController {
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    create(createSessionDto) {
        return this.sessionsService.create(createSessionDto);
    }
    findAll(query) {
        return this.sessionsService.findAll(query);
    }
    findByMovie(movieId) {
        return this.sessionsService.findByMovie(movieId);
    }
    findByDate(date) {
        return this.sessionsService.findByDate(new Date(date));
    }
    getStats() {
        return this.sessionsService.stats();
    }
    findOne(id) {
        return this.sessionsService.findOne(id);
    }
    update(id, updateSessionDto) {
        return this.sessionsService.update(id, updateSessionDto);
    }
    reserveSeats(id, reserveSeatsDto) {
        return this.sessionsService.reserveSeats(id, reserveSeatsDto.seats);
    }
    releaseSeats(id, reserveSeatsDto) {
        return this.sessionsService.releaseSeats(id, reserveSeatsDto.seats);
    }
    remove(id) {
        return this.sessionsService.remove(id);
    }
};
exports.SessionsController = SessionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle séance (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Séance créée' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_dto_1.CreateSessionDto]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir toutes les séances' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des séances' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_dto_1.SessionQueryDto]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('movie/:movieId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les séances dun film' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Séances du film' }),
    __param(0, (0, common_1.Param)('movieId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "findByMovie", null);
__decorate([
    (0, common_1.Get)('date/:date'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les séances par date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Séances de la date' }),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les statistiques des séances (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistiques' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir une séance par ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Détails de la séance' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Séance non trouvée' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une séance (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Séance mise à jour' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Séance non trouvée' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, session_dto_1.UpdateSessionDto]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/reserve-seats'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Réserver des places' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Places réservées' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Places non disponibles' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, session_dto_1.ReserveSeatsDto]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "reserveSeats", null);
__decorate([
    (0, common_1.Post)(':id/release-seats'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Libérer des places (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Places libérées' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, session_dto_1.ReserveSeatsDto]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "releaseSeats", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une séance (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Séance supprimée' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Séance non trouvée' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "remove", null);
exports.SessionsController = SessionsController = __decorate([
    (0, swagger_1.ApiTags)('Sessions'),
    (0, common_1.Controller)('sessions'),
    __metadata("design:paramtypes", [sessions_service_1.SessionsService])
], SessionsController);
//# sourceMappingURL=sessions.controller.js.map