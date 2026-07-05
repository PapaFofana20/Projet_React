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
exports.Session = exports.ScreenType = exports.SessionType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const movie_entity_1 = require("../../movies/entities/movie.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
const hall_entity_1 = require("../../cinemas/entities/hall.entity");
var SessionType;
(function (SessionType) {
    SessionType["STANDARD"] = "standard";
    SessionType["THREE_D"] = "3D";
    SessionType["IMAX"] = "IMAX";
    SessionType["VIP"] = "VIP";
    SessionType["DOLBY"] = "Dolby Atmos";
})(SessionType || (exports.SessionType = SessionType = {}));
var ScreenType;
(function (ScreenType) {
    ScreenType["REGULAR"] = "regular";
    ScreenType["LARGE"] = "large";
    ScreenType["SMALL"] = "small";
})(ScreenType || (exports.ScreenType = ScreenType = {}));
let Session = class Session {
};
exports.Session = Session;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identifiant unique de la séance' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Session.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du film' }),
    (0, typeorm_1.Column)({ name: 'movie_id' }),
    __metadata("design:type", Number)
], Session.prototype, "movieId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Film associé' }),
    (0, typeorm_1.ManyToOne)(() => movie_entity_1.Movie, (movie) => movie.sessions, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'movie_id' }),
    __metadata("design:type", movie_entity_1.Movie)
], Session.prototype, "movie", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la salle' }),
    (0, typeorm_1.Column)({ name: 'hall_id', nullable: true }),
    __metadata("design:type", Number)
], Session.prototype, "hallId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Salle associée' }),
    (0, typeorm_1.ManyToOne)(() => hall_entity_1.Hall, (hall) => hall.sessions, { eager: false, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'hall_id' }),
    __metadata("design:type", hall_entity_1.Hall)
], Session.prototype, "hall", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom de la salle' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Session.prototype, "roomName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type décran' }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ScreenType,
        default: ScreenType.REGULAR,
    }),
    __metadata("design:type", String)
], Session.prototype, "screenType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SessionType, description: 'Type de séance' }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SessionType,
        default: SessionType.STANDARD,
    }),
    __metadata("design:type", String)
], Session.prototype, "sessionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date et heure de la séance' }),
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Session.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date et heure de fin estimée' }),
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Session.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prix du billet en FCFA' }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Session.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre total de places' }),
    (0, typeorm_1.Column)({ type: 'int', default: 100, name: 'total_seats' }),
    __metadata("design:type", Number)
], Session.prototype, "totalSeats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de places disponibles' }),
    (0, typeorm_1.Column)({ type: 'int', default: 100, name: 'available_seats' }),
    __metadata("design:type", Number)
], Session.prototype, "availableSeats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Places réservées (format JSON)' }),
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true, name: 'reserved_seats' }),
    __metadata("design:type", Array)
], Session.prototype, "reservedSeats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'La séance est-elle active ?' }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Session.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Réservations pour cette séance' }),
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.session),
    __metadata("design:type", Array)
], Session.prototype, "bookings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de création' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Session.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de mise à jour' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Session.prototype, "updatedAt", void 0);
exports.Session = Session = __decorate([
    (0, typeorm_1.Entity)('sessions')
], Session);
//# sourceMappingURL=session.entity.js.map