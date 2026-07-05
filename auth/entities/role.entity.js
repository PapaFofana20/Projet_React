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
exports.Role = exports.RoleLevel = exports.RoleName = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const cinema_entity_1 = require("../../cinemas/entities/cinema.entity");
var RoleName;
(function (RoleName) {
    RoleName["SUPER_ADMIN"] = "super_admin";
    RoleName["ADMIN"] = "admin";
    RoleName["AGENT"] = "agent";
    RoleName["USER"] = "user";
})(RoleName || (exports.RoleName = RoleName = {}));
var RoleLevel;
(function (RoleLevel) {
    RoleLevel[RoleLevel["SUPER_ADMIN"] = 100] = "SUPER_ADMIN";
    RoleLevel[RoleLevel["ADMIN"] = 50] = "ADMIN";
    RoleLevel[RoleLevel["AGENT"] = 20] = "AGENT";
    RoleLevel[RoleLevel["USER"] = 1] = "USER";
})(RoleLevel || (exports.RoleLevel = RoleLevel = {}));
let Role = class Role {
};
exports.Role = Role;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identifiant unique du rôle' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Role.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: RoleName, description: 'Nom du rôle' }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RoleName,
        unique: true,
        default: RoleName.USER,
    }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Niveau de permission du rôle' }),
    (0, typeorm_1.Column)({
        type: 'int',
        default: RoleLevel.USER,
    }),
    __metadata("design:type", Number)
], Role.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description du rôle' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de création' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Role.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de mise à jour' }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Role.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Utilisateurs ayant ce rôle' }),
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.roles),
    __metadata("design:type", Array)
], Role.prototype, "users", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cinémas gérés par ce rôle (pour admins)' }),
    (0, typeorm_1.OneToMany)(() => cinema_entity_1.Cinema, (cinema) => cinema.managedBy),
    __metadata("design:type", Array)
], Role.prototype, "managedCinemas", void 0);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)('roles')
], Role);
//# sourceMappingURL=role.entity.js.map