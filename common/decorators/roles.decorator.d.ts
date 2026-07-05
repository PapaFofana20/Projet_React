import { RoleName } from '../../auth/entities/role.entity';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: RoleName[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const MIN_ROLE_LEVEL_KEY = "minRoleLevel";
export declare const MinRoleLevel: (level: number) => import("@nestjs/common").CustomDecorator<string>;
export declare const PERMISSIONS_KEY = "permissions";
export declare enum Permission {
    USERS_VIEW = "users:view",
    USERS_CREATE = "users:create",
    USERS_UPDATE = "users:update",
    USERS_DELETE = "users:delete",
    USERS_MANAGE_ROLES = "users:manage_roles",
    CINEMAS_VIEW = "cinemas:view",
    CINEMAS_CREATE = "cinemas:create",
    CINEMAS_UPDATE = "cinemas:update",
    CINEMAS_DELETE = "cinemas:delete",
    HALLS_VIEW = "halls:view",
    HALLS_CREATE = "halls:create",
    HALLS_UPDATE = "halls:update",
    HALLS_DELETE = "halls:delete",
    MOVIES_VIEW = "movies:view",
    MOVIES_CREATE = "movies:create",
    MOVIES_UPDATE = "movies:update",
    MOVIES_DELETE = "movies:delete",
    MOVIES_FEATURED = "movies:featured",
    SESSIONS_VIEW = "sessions:view",
    SESSIONS_CREATE = "sessions:create",
    SESSIONS_UPDATE = "sessions:update",
    SESSIONS_DELETE = "sessions:delete",
    BOOKINGS_VIEW = "bookings:view",
    BOOKINGS_CREATE = "bookings:create",
    BOOKINGS_UPDATE = "bookings:update",
    BOOKINGS_CANCEL = "bookings:cancel",
    BOOKINGS_REFUND = "bookings:refund",
    REPORTS_VIEW = "reports:view",
    REPORTS_EXPORT = "reports:export",
    SETTINGS_VIEW = "settings:view",
    SETTINGS_UPDATE = "settings:update"
}
export declare const RequirePermissions: (...permissions: Permission[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const ROLE_PERMISSIONS: Record<RoleName, Permission[]>;
