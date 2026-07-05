import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, MIN_ROLE_LEVEL_KEY, PERMISSIONS_KEY, Permission, ROLE_PERMISSIONS } from '../../common/decorators/roles.decorator';
import { RoleName, RoleLevel } from '../entities/role.entity';

/**
 * Guard RBAC avancé pour le contrôle daccès basé sur les rôles et permissions
 * Vérifie:
 * 1. Si l'utilisateur est authentifié
 * 2. Si l'utilisateur a les rôles requis
 * 3. Si l'utilisateur a le niveau de permission minimum
 * 4. Si l'utilisateur a les permissions spécifiques requises
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupérer les métadonnées
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const minRoleLevel = this.reflector.getAllAndOverride<number>(
      MIN_ROLE_LEVEL_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si aucune restriction nest définie, accès refusé par défaut
    if (!requiredRoles && !minRoleLevel && !requiredPermissions) {
      // Autoriser l'accès si aucune protection n'est définie
      return true;
    }

    // Récupérer l'utilisateur depuis la requête
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentification requise');
    }

    // Vérification du statut de l'utilisateur
    if (user.status === 'suspended' || user.status === 'blocked') {
      throw new ForbiddenException('Compte suspendu ou bloqué');
    }

    // Vérifier si l'utilisateur a des rôles
    if (!user.roles || user.roles.length === 0) {
      throw new ForbiddenException('Aucun rôle assigné');
    }

    // Extraire les noms de rôles et le niveau maximum de l'utilisateur
    const userRoles = user.roles.map((role: any) => role.name || role);
    const userMaxLevel = Math.max(
      ...user.roles.map((role: any) => role.level || RoleLevel.USER),
    );

    // 1. Vérification du niveau de permission minimum
    if (minRoleLevel !== undefined && userMaxLevel < minRoleLevel) {
      throw new ForbiddenException(
        `Niveau de permission insuffisant. Requis: ${minRoleLevel}, Actuel: ${userMaxLevel}`,
      );
    }

    // 2. Vérification des rôles requis (au moins un)
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role),
      );

      if (!hasRequiredRole) {
        throw new ForbiddenException(
          `Accès refusé. Rôles requis: ${requiredRoles.join(' ou ')}. Rôles possessionnés: ${userRoles.join(', ')}`,
        );
      }
    }

    // 3. Vérification des permissions spécifiques
    if (requiredPermissions && requiredPermissions.length > 0) {
      // Collecter toutes les permissions de l'utilisateur
      const userPermissions = new Set<Permission>();
      userRoles.forEach((roleName: RoleName) => {
        const rolePermissions = ROLE_PERMISSIONS[roleName] || [];
        rolePermissions.forEach((perm) => userPermissions.add(perm));
      });

      // Ajouter les permissions individuelles de l'utilisateur si elles existent
      if (user.permissions && Array.isArray(user.permissions)) {
        user.permissions.forEach((perm: Permission) =>
          userPermissions.add(perm),
        );
      }

      // Vérifier que toutes les permissions requises sont présentes
      const missingPermissions = requiredPermissions.filter(
        (perm) => !userPermissions.has(perm),
      );

      if (missingPermissions.length > 0) {
        throw new ForbiddenException(
          `Permissions insuffisantes. Manquantes: ${missingPermissions.join(', ')}`,
        );
      }
    }

    return true;
  }
}

/**
 * Guard simplifié pour la vérification rapide des rôles
 * À utiliser pour les endpoints où seuls les rôles comptent
 */
@Injectable()
export class SimpleRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('Accès refusé - Rôles requis');
    }

    const userRoles = user.roles.map((role: any) => role.name || role);
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Accès refusé - Vous devez avoir le rôle: ${requiredRoles.join(' ou ')}`,
      );
    }

    return true;
  }
}
