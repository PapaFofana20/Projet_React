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
exports.Hall = exports.ScreenType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const cinema_entity_1 = require("./cinema.entity");
const seat_layout_entity_1 = require("./seat-layout.entity");
const session_entity_1 = require("../../sessions/entities/session.entity");
var ScreenType;
(function (ScreenType) {
    ScreenType["TWO_D"] = "2D";
    ScreenType["THREE_D"] = "3D";
    ScreenType["IMAX"] = "IMAX";
    ScreenType["DOLBY_ATMOS"] = "Dolby Atmos";
    ScreenType["VIP"] = "VIP";
})(ScreenType || (exports.ScreenType = ScreenType = {}));
let Hall = class Hall {
};
exports.Hall = Hall;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identifiant unique de la salle' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Hall.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du cinéma parent' }),
    (0, typeorm_1.Column)({ name: 'cinema_id' }),
    __metadata("design:type", Number)
], Hall.prototype, "cinemaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cinéma parent' }),
    (0, typeorm_1.ManyToOne)(() => cinema_entity_1.Cinema, (cinema) => cinema.halls, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'cinema_id' }),
    __metadata("design:type", cinema_entity_1.Cinema)
], Hall.prototype, "cinema", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom de la salle (ex: Salle 1, Salle VIP)' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Hall.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Capacité totale de la salle' }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Hall.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ScreenType, description: 'Type décran' }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ScreenType,
        default: ScreenType.TWO_D,
    }),
    __metadata("design:type", String)
], Hall.prototype, "screenType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de rangées de sièges' }),
    (0, typeorm_1.Column)({ type: 'int', name: 'row_count' }),
    __metadata("design:type", Number)
], Hall.prototype, "rowCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de sièges par rangée' }),
    (0, typeorm_1.Column)({ type: 'int', name: 'seats_per_row' }),
    __metadata("design:type", Number)
], Hall.prototype, "seatsPerRow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prix de base pour cette salle (FCFA)' }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'base_price' }),
    __metadata("design:type", Number)
], Hall.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prix VIP pour cette salle (FCFA)' }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'vip_price' }),
    __metadata("design:type", Number)
], Hall.prototype, "vipPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description de la salle' }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Hall.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'La salle est-elle active ?' }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Hall.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dispositions des sièges' }),
    (0, typeorm_1.OneToMany)(() => seat_layout_entity_1.SeatLayout, (seatLayout) => seatLayout.hall),
    __metadata("design:type", Array)
], Hall.prototype, "seatLayouts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Séances dans cette salle' }),
    (0, typeorm_1.OneToMany)(() => session_entity_1.Session, (session) => session.hall),
    __metadata("design:type", Array)
], Hall.prototype, "sessions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de création' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Hall.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de mise à jour' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Hall.prototype, "updatedAt", void 0);
exports.Hall = Hall = __decorate([
    (0, typeorm_1.Entity)('halls')
], Hall);
//# sourceMappingURL=hall.entity.js.map