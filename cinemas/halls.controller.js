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
exports.HallsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const halls_service_1 = require("./halls.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_entity_1 = require("../auth/entities/role.entity");
let HallsController = class HallsController {
    constructor(hallsService) {
        this.hallsService = hallsService;
    }
    async findAll() {
        return this.hallsService.findAll();
    }
    async findByCinema(cinemaId) {
        return this.hallsService.findByCinema(cinemaId);
    }
    async findOne(id) {
        return this.hallsService.findOne(id);
    }
    async create(data) {
        return this.hallsService.create(data);
    }
    async update(id, data) {
        return this.hallsService.update(id, data);
    }
    async remove(id) {
        await this.hallsService.remove(id);
        return { message: 'Salle supprimée avec succès' };
    }
    async getSeatLayout(id) {
        return this.hallsService.getSeatLayout(id);
    }
    async updateSeat(id, seatId, status) {
        return this.hallsService.updateSeat(id, seatId, status);
    }
};
exports.HallsController = HallsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des salles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('cinema/:cinemaId'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN, role_entity_1.RoleName.AGENT),
    (0, swagger_1.ApiOperation)({ summary: 'Salles par cinéma' }),
    __param(0, (0, common_1.Param)('cinemaId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "findByCinema", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Détails dune salle' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle salle (avec générationauto de la grille)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une salle' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une salle' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/seats'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN, role_entity_1.RoleName.AGENT),
    (0, swagger_1.ApiOperation)({ summary: 'Disposition des sièges dune salle' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "getSeatLayout", null);
__decorate([
    (0, common_1.Put)(':id/seats/:seatId'),
    (0, roles_decorator_1.Roles)(role_entity_1.RoleName.ADMIN, role_entity_1.RoleName.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un siège (bloquer/débloquer)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('seatId')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], HallsController.prototype, "updateSeat", null);
exports.HallsController = HallsController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Salles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('admin/halls'),
    __metadata("design:paramtypes", [halls_service_1.HallsService])
], HallsController);
//# sourceMappingURL=halls.controller.js.map