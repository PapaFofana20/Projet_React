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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users/entities/user.entity");
const role_entity_1 = require("./entities/role.entity");
let AuthService = class AuthService {
    constructor(users, roles, jwt, config) {
        this.users = users;
        this.roles = roles;
        this.jwt = jwt;
        this.config = config;
    }
    async register(dto) {
        const exists = await this.users.findOne({ where: { email: dto.email } });
        if (exists)
            throw new common_1.ConflictException('Cet e-mail est déjà utilisé');
        const userRole = await this.roles.findOne({ where: { name: role_entity_1.RoleName.USER } });
        const user = this.users.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            password: await bcrypt.hash(dto.password, 10),
            dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
            roles: userRole ? [userRole] : [],
        });
        await this.users.save(user);
        return {
            user: this.sanitize(user),
            ...(await this.generateTokens(user)),
        };
    }
    async login(dto) {
        const user = await this.users.findOne({
            where: { email: dto.email },
            relations: ['roles'],
        });
        if (!user)
            throw new common_1.UnauthorizedException('E-mail ou mot de passe incorrect');
        if (user.status === user_entity_1.UserStatus.SUSPENDED)
            throw new common_1.UnauthorizedException('Compte suspendu');
        if (user.status === user_entity_1.UserStatus.INACTIVE)
            throw new common_1.UnauthorizedException('Compte inactif');
        if (!(await bcrypt.compare(dto.password, user.password))) {
            throw new common_1.UnauthorizedException('E-mail ou mot de passe incorrect');
        }
        await this.users.update(user.id, { lastLoginAt: new Date() });
        return {
            user: this.sanitize(user),
            ...(await this.generateTokens(user)),
        };
    }
    async getProfile(userId) {
        const user = await this.users.findOne({
            where: { id: userId },
            relations: ['roles'],
        });
        if (!user)
            throw new common_1.UnauthorizedException('Utilisateur non trouvé');
        return this.sanitize(user);
    }
    async refreshToken(userId) {
        const user = await this.users.findOne({
            where: { id: userId },
            relations: ['roles'],
        });
        if (!user)
            throw new common_1.UnauthorizedException('Utilisateur non trouvé');
        return this.generateTokens(user);
    }
    async changePassword(userId, current, novo) {
        const user = await this.users.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('Utilisateur non trouvé');
        if (!(await bcrypt.compare(current, user.password))) {
            throw new common_1.UnauthorizedException('Mot de passe actuel incorrect');
        }
        user.password = await bcrypt.hash(novo, 10);
        await this.users.save(user);
        return { message: 'Mot de passe changé' };
    }
    async generateTokens(user) {
        const payload = { sub: user.id, email: user.email, roles: user.roles.map(r => r.name) };
        const secret = this.config.get('JWT_SECRET');
        const [access, refresh] = await Promise.all([
            this.jwt.signAsync(payload, { secret, expiresIn: '15m' }),
            this.jwt.signAsync(payload, { secret, expiresIn: '7d' }),
        ]);
        return { accessToken: access, refreshToken: refresh, tokenType: 'Bearer' };
    }
    sanitize(user) {
        const { password, ...rest } = user;
        return rest;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map