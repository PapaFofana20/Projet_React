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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cinema = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const hall_entity_1 = require("./hall.entity");
const role_entity_1 = require("../../auth/entities/role.entity");
let Cinema = class Cinema {
};
exports.Cinema = Cinema;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identifiant unique du cinéma' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cinema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom du cinéma' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Cinema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ville où se trouve le cinéma' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Cinema.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Adresse complète du cinéma' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Cinema.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Numéro de téléphone du cinéma' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Cinema.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email de contact' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Cinema.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL de limage du cinéma' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true, name: 'image_url' }),
    __metadata("design:type", String)
], Cinema.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coordonnées GPS - Latitude' }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Cinema.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coordonnées GPS - Longitude' }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Cinema.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Horaires douverture (format JSON)' }),
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], Cinema.prototype, "openingHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Le cinéma est-il actif ?' }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Cinema.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de ladmin gestionnaire (nullable)' }),
    (0, typeorm_1.Column)({ name: 'managed_by', nullable: true }),
    __metadata("design:type", Number)
], Cinema.prototype, "managedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Admin gestionnaire du cinéma' }),
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role, (role) => role.managedCinemas, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'managed_by' }),
    __metadata("design:type", role_entity_1.Role)
], Cinema.prototype, "managedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Salles du cinéma' }),
    (0, typeorm_1.OneToMany)(() => hall_entity_1.Hall, (hall) => hall.cinema),
    __metadata("design:type", Array)
], Cinema.prototype, "halls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de création' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Cinema.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de mise à jour' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Cinema.prototype, "updatedAt", void 0);
exports.Cinema = Cinema = __decorate([
    (0, typeorm_1.Entity)('cinemas')
], Cinema);
//# sourceMappingURL=cinema.entity.js.map