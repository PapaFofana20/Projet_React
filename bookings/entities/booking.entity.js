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
exports.Booking = exports.PaymentMethod = exports.BookingStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const session_entity_1 = require("../../sessions/entities/session.entity");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["COMPLETED"] = "completed";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["ORANGE_MONEY"] = "orange_money";
    PaymentMethod["WAV_MONEY"] = "wav_money";
    PaymentMethod["CARD"] = "card";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identifiant unique de la réservation' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Code unique de la réservation' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Booking.prototype, "bookingCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de lutilisateur' }),
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], Booking.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Utilisateur associé' }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bookings, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la séance' }),
    (0, typeorm_1.Column)({ name: 'session_id' }),
    __metadata("design:type", Number)
], Booking.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Séance associée' }),
    (0, typeorm_1.ManyToOne)(() => session_entity_1.Session, (session) => session.bookings, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", session_entity_1.Session)
], Booking.prototype, "session", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: BookingStatus,
        description: 'Statut de la réservation',
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Places réservées' }),
    (0, typeorm_1.Column)({ type: 'simple-json' }),
    __metadata("design:type", Array)
], Booking.prototype, "seats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de billets' }),
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Booking.prototype, "ticketCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prix total en FCFA' }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' }),
    __metadata("design:type", Number)
], Booking.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: PaymentMethod,
        description: 'Méthode de paiement',
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentMethod,
        name: 'payment_method',
    }),
    __metadata("design:type", String)
], Booking.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID (pour paiements numériques)' }),
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: true,
        name: 'transaction_id',
    }),
    __metadata("design:type", String)
], Booking.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Numéro de téléphone pour le paiement' }),
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        nullable: true,
        name: 'payment_phone',
    }),
    __metadata("design:type", String)
], Booking.prototype, "paymentPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Code QR pour le billet', required: false }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'qr_code' }),
    __metadata("design:type", String)
], Booking.prototype, "qrCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom du spectateur' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'viewer_name' }),
    __metadata("design:type", String)
], Booking.prototype, "viewerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email du spectateur' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'viewer_email' }),
    __metadata("design:type", String)
], Booking.prototype, "viewerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de création' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de mise à jour' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Booking.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date dannulation', required: false }),
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true, name: 'cancelled_at' }),
    __metadata("design:type", Date)
], Booking.prototype, "cancelledAt", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings')
], Booking);
//# sourceMappingURL=booking.entity.js.map