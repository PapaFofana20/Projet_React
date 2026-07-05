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
exports.SeatLayout = exports.SeatStatus = exports.SeatType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const hall_entity_1 = require("./hall.entity");
var SeatType;
(function (SeatType) {
    SeatType["STANDARD"] = "standard";
    SeatType["VIP"] = "vip";
    SeatType["HANDICAPPED"] = "handicapped";
    SeatType["COUPLE"] = "couple";
})(SeatType || (exports.SeatType = SeatType = {}));
var SeatStatus;
(function (SeatStatus) {
    SeatStatus["AVAILABLE"] = "available";
    SeatStatus["BLOCKED"] = "blocked";
    SeatStatus["MAINTENANCE"] = "maintenance";
})(SeatStatus || (exports.SeatStatus = SeatStatus = {}));
let SeatLayout = class SeatLayout {
};
exports.SeatLayout = SeatLayout;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identifiant unique' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SeatLayout.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la salle parente' }),
    (0, typeorm_1.Column)({ name: 'hall_id' }),
    __metadata("design:type", Number)
], SeatLayout.prototype, "hallId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Salle parente' }),
    (0, typeorm_1.ManyToOne)(() => hall_entity_1.Hall, (hall) => hall.seatLayouts, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'hall_id' }),
    __metadata("design:type", hall_entity_1.Hall)
], SeatLayout.prototype, "hall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Configuration JSON de la grille des sièges',
        example: { A1: { type: 'standard', status: 'available' } },
    }),
    (0, typeorm_1.Column)({ type: 'simple-json' }),
    __metadata("design:type", Object)
], SeatLayout.prototype, "seatGrid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Liste des sièges VIP' }),
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true, name: 'vip_seats' }),
    __metadata("design:type", Array)
], SeatLayout.prototype, "vipSeats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Liste des siègeshandicapés' }),
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true, name: 'handicapped_seats' }),
    __metadata("design:type", Array)
], SeatLayout.prototype, "handicappedSeats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Liste des sièges couple' }),
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true, name: 'couple_seats' }),
    __metadata("design:type", Array)
], SeatLayout.prototype, "coupleSeats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sièges temporairement bloqués' }),
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], SeatLayout.prototype, "blockedSeats", void 0);
exports.SeatLayout = SeatLayout = __decorate([
    (0, typeorm_1.Entity)('seat_layouts')
], SeatLayout);
//# sourceMappingURL=seat-layout.entity.js.map