import { SetMetadata } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { RoleName, RoleLevel } from '../../auth/entities/role.entity';

/**
 * Clé pour stocker les rôles requis dans les métadonnées
 */
export const ROLES_KEY = 'roles';

/**
 * Décorateur pour définir les rôles requis pour un endpoint
 * Utilisation: @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
 */
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Clé pour le niveau de permission minimum requis
 */
export const MIN_ROLE_LEVEL_KEY = 'minRoleLevel';

/**
 * Décorateur pour définir le niveau de permission minimum requis
 * Utile pour les permissions hiérarchiques
 * Utilisation: @MinRoleLevel(RoleLevel.ADMIN)
 */
export const MinRoleLevel = (level: number) =>
  SetMetadata(MIN_ROLE_LEVEL_KEY, level);

/**
 * Clé pour les permissions spécifiques
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Énumération des permissions spécifiques
 */
export enum Permission {
  // Utilisateurs
  USERS_VIEW = 'users:view',
  USERS_CREATE = 'users:create',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  USERS_MANAGE_ROLES = 'users:manage_roles',

  // Cinémas
  CINEMAS_VIEW = 'cinemas:view',
  CINEMAS_CREATE = 'cinemas:create',
  CINEMAS_UPDATE = 'cinemas:update',
  CINEMAS_DELETE = 'cinemas:delete',

  // Salles
  HALLS_VIEW = 'halls:view',
  HALLS_CREATE = 'halls:create',
  HALLS_UPDATE = 'halls:update',
  HALLS_DELETE = 'halls:delete',

  // Films
  MOVIES_VIEW = 'movies:view',
  MOVIES_CREATE = 'movies:create',
  MOVIES_UPDATE = 'movies:update',
  MOVIES_DELETE = 'movies:delete',
  MOVIES_FEATURED = 'movies:featured',

  // Séances
  SESSIONS_VIEW = 'sessions:view',
  SESSIONS_CREATE = 'sessions:create',
  SESSIONS_UPDATE = 'sessions:update',
  SESSIONS_DELETE = 'sessions:delete',

  // Réservations
  BOOKINGS_VIEW = 'bookings:view',
  BOOKINGS_CREATE = 'bookings:create',
  BOOKINGS_UPDATE = 'bookings:update',
  BOOKINGS_CANCEL = 'bookings:cancel',
  BOOKINGS_REFUND = 'bookings:refund',

  // Rapports
  REPORTS_VIEW = 'reports:view',
  REPORTS_EXPORT = 'reports:export',

  // Paramètres
  SETTINGS_VIEW = 'settings:view',
  SETTINGS_UPDATE = 'settings:update',
}

/**
 * Décorateur pour définir les permissions requises
 * Utilisation: @RequirePermissions(Permission.USERS_CREATE, Permission.USERS_UPDATE)
 */
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Mapping des rôles vers leurs permissions par défaut
 */
export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  [RoleName.SUPER_ADMIN]: Object.values(Permission), // Toutes les permissions
  [RoleName.ADMIN]: [
    // Utilisateurs
    Permission.USERS_VIEW,
    Permission.USERS_UPDATE,
    // Cinémas
    Permission.CINEMAS_VIEW,
    Permission.CINEMAS_UPDATE,
    // Salles
    Permission.HALLS_VIEW,
    Permission.HALLS_CREATE,
    Permission.HALLS_UPDATE,
    // Films
    Permission.MOVIES_VIEW,
    Permission.MOVIES_CREATE,
    Permission.MOVIES_UPDATE,
    Permission.MOVIES_FEATURED,
    // Séances
    Permission.SESSIONS_VIEW,
    Permission.SESSIONS_CREATE,
    Permission.SESSIONS_UPDATE,
    Permission.SESSIONS_DELETE,
    // Réservations
    Permission.BOOKINGS_VIEW,
    Permission.BOOKINGS_CREATE,
    Permission.BOOKINGS_UPDATE,
    Permission.BOOKINGS_CANCEL,
    // Rapports
    Permission.REPORTS_VIEW,
    Permission.REPORTS_EXPORT,
  ],
  [RoleName.AGENT]: [
    // Films
    Permission.MOVIES_VIEW,
    // Salles
    Permission.HALLS_VIEW,
    // Séances
    Permission.SESSIONS_VIEW,
    // Réservations
    Permission.BOOKINGS_VIEW,
    Permission.BOOKINGS_CREATE,
    Permission.BOOKINGS_UPDATE,
  ],
  [RoleName.USER]: [], // Aucune permission admin
};
