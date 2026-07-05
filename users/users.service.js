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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(users) {
        this.users = users;
    }
    findAll(page = 1, limit = 10) {
        return this.users.findAndCount({
            relations: ['roles'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        }).then(([users, total]) => ({
            data: users.map(u => this.sanitize(u)),
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        }));
    }
    findOne(id) {
        return this.users.findOne({
            where: { id },
            relations: ['roles', 'bookings'],
        }).then(user => {
            if (!user)
                throw new common_1.NotFoundException(`Utilisateur ${id} non trouvé`);
            return this.sanitize(user);
        });
    }
    findByEmail(email) {
        return this.users.findOne({ where: { email }, relations: ['roles'] })
            .then(user => user ? this.sanitize(user) : null);
    }
    async update(id, dto) {
        const user = await this.users.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Utilisateur ${id} non trouvé`);
        if (dto.dateOfBirth)
            dto.dateOfBirth = new Date(dto.dateOfBirth);
        await this.users.update(id, dto);
        return this.findOne(id);
    }
    async updateStatus(id, dto) {
        const user = await this.users.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Utilisateur ${id} non trouvé`);
        await this.users.update(id, { status: dto.status });
        return this.findOne(id);
    }
    async remove(id) {
        const user = await this.users.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Utilisateur ${id} non trouvé`);
        await this.users.remove(user);
        return { message: 'Utilisateur supprimé' };
    }
    async stats(id) {
        const user = await this.users.findOne({
            where: { id },
            relations: ['bookings'],
        });
        if (!user)
            throw new common_1.NotFoundException(`Utilisateur ${id} non trouvé`);
        const bookings = user.bookings || [];
        return {
            userId: id,
            totalBookings: bookings.length,
            totalSpent: bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0),
            accountCreated: user.createdAt,
            lastLogin: user.lastLoginAt,
        };
    }
    sanitize(user) {
        const { password, ...rest } = user;
        return rest;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map