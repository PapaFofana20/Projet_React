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
exports.SimpleRolesGuard = exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_entity_1 = require("../entities/role.entity");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        const minRoleLevel = this.reflector.getAllAndOverride(roles_decorator_1.MIN_ROLE_LEVEL_KEY, [context.getHandler(), context.getClass()]);
        const requiredPermissions = this.reflector.getAllAndOverride(roles_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles && !minRoleLevel && !requiredPermissions) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('Authentification requise');
        }
        if (user.status === 'suspended' || user.status === 'blocked') {
            throw new common_1.ForbiddenException('Compte suspendu ou bloqué');
        }
        if (!user.roles || user.roles.length === 0) {
            throw new common_1.ForbiddenException('Aucun rôle assigné');
        }
        const userRoles = user.roles.map((role) => role.name || role);
        const userMaxLevel = Math.max(...user.roles.map((role) => role.level || role_entity_1.RoleLevel.USER));
        if (minRoleLevel !== undefined && userMaxLevel < minRoleLevel) {
            throw new common_1.ForbiddenException(`Niveau de permission insuffisant. Requis: ${minRoleLevel}, Actuel: ${userMaxLevel}`);
        }
        if (requiredRoles && requiredRoles.length > 0) {
            const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));
            if (!hasRequiredRole) {
                throw new common_1.ForbiddenException(`Accès refusé. Rôles requis: ${requiredRoles.join(' ou ')}. Rôles possessionnés: ${userRoles.join(', ')}`);
            }
        }
        if (requiredPermissions && requiredPermissions.length > 0) {
            const userPermissions = new Set();
            userRoles.forEach((roleName) => {
                const rolePermissions = roles_decorator_1.ROLE_PERMISSIONS[roleName] || [];
                rolePermissions.forEach((perm) => userPermissions.add(perm));
            });
            if (user.permissions && Array.isArray(user.permissions)) {
                user.permissions.forEach((perm) => userPermissions.add(perm));
            }
            const missingPermissions = requiredPermissions.filter((perm) => !userPermissions.has(perm));
            if (missingPermissions.length > 0) {
                throw new common_1.ForbiddenException(`Permissions insuffisantes. Manquantes: ${missingPermissions.join(', ')}`);
            }
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
let SimpleRolesGuard = class SimpleRolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.roles) {
            throw new common_1.ForbiddenException('Accès refusé - Rôles requis');
        }
        const userRoles = user.roles.map((role) => role.name || role);
        const hasRole = requiredRoles.some((role) => userRoles.includes(role));
        if (!hasRole) {
            throw new common_1.ForbiddenException(`Accès refusé - Vous devez avoir le rôle: ${requiredRoles.join(' ou ')}`);
        }
        return true;
    }
};
exports.SimpleRolesGuard = SimpleRolesGuard;
exports.SimpleRolesGuard = SimpleRolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], SimpleRolesGuard);
//# sourceMappingURL=roles.guard.js.map