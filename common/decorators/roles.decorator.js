"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.RequirePermissions = exports.Permission = exports.PERMISSIONS_KEY = exports.MinRoleLevel = exports.MIN_ROLE_LEVEL_KEY = exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
const role_entity_1 = require("../../auth/entities/role.entity");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
exports.MIN_ROLE_LEVEL_KEY = 'minRoleLevel';
const MinRoleLevel = (level) => (0, common_1.SetMetadata)(exports.MIN_ROLE_LEVEL_KEY, level);
exports.MinRoleLevel = MinRoleLevel;
exports.PERMISSIONS_KEY = 'permissions';
var Permission;
(function (Permission) {
    Permission["USERS_VIEW"] = "users:view";
    Permission["USERS_CREATE"] = "users:create";
    Permission["USERS_UPDATE"] = "users:update";
    Permission["USERS_DELETE"] = "users:delete";
    Permission["USERS_MANAGE_ROLES"] = "users:manage_roles";
    Permission["CINEMAS_VIEW"] = "cinemas:view";
    Permission["CINEMAS_CREATE"] = "cinemas:create";
    Permission["CINEMAS_UPDATE"] = "cinemas:update";
    Permission["CINEMAS_DELETE"] = "cinemas:delete";
    Permission["HALLS_VIEW"] = "halls:view";
    Permission["HALLS_CREATE"] = "halls:create";
    Permission["HALLS_UPDATE"] = "halls:update";
    Permission["HALLS_DELETE"] = "halls:delete";
    Permission["MOVIES_VIEW"] = "movies:view";
    Permission["MOVIES_CREATE"] = "movies:create";
    Permission["MOVIES_UPDATE"] = "movies:update";
    Permission["MOVIES_DELETE"] = "movies:delete";
    Permission["MOVIES_FEATURED"] = "movies:featured";
    Permission["SESSIONS_VIEW"] = "sessions:view";
    Permission["SESSIONS_CREATE"] = "sessions:create";
    Permission["SESSIONS_UPDATE"] = "sessions:update";
    Permission["SESSIONS_DELETE"] = "sessions:delete";
    Permission["BOOKINGS_VIEW"] = "bookings:view";
    Permission["BOOKINGS_CREATE"] = "bookings:create";
    Permission["BOOKINGS_UPDATE"] = "bookings:update";
    Permission["BOOKINGS_CANCEL"] = "bookings:cancel";
    Permission["BOOKINGS_REFUND"] = "bookings:refund";
    Permission["REPORTS_VIEW"] = "reports:view";
    Permission["REPORTS_EXPORT"] = "reports:export";
    Permission["SETTINGS_VIEW"] = "settings:view";
    Permission["SETTINGS_UPDATE"] = "settings:update";
})(Permission || (exports.Permission = Permission = {}));
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.RequirePermissions = RequirePermissions;
exports.ROLE_PERMISSIONS = {
    [role_entity_1.RoleName.SUPER_ADMIN]: Object.values(Permission),
    [role_entity_1.RoleName.ADMIN]: [
        Permission.USERS_VIEW,
        Permission.USERS_UPDATE,
        Permission.CINEMAS_VIEW,
        Permission.CINEMAS_UPDATE,
        Permission.HALLS_VIEW,
        Permission.HALLS_CREATE,
        Permission.HALLS_UPDATE,
        Permission.MOVIES_VIEW,
        Permission.MOVIES_CREATE,
        Permission.MOVIES_UPDATE,
        Permission.MOVIES_FEATURED,
        Permission.SESSIONS_VIEW,
        Permission.SESSIONS_CREATE,
        Permission.SESSIONS_UPDATE,
        Permission.SESSIONS_DELETE,
        Permission.BOOKINGS_VIEW,
        Permission.BOOKINGS_CREATE,
        Permission.BOOKINGS_UPDATE,
        Permission.BOOKINGS_CANCEL,
        Permission.REPORTS_VIEW,
        Permission.REPORTS_EXPORT,
    ],
    [role_entity_1.RoleName.AGENT]: [
        Permission.MOVIES_VIEW,
        Permission.HALLS_VIEW,
        Permission.SESSIONS_VIEW,
        Permission.BOOKINGS_VIEW,
        Permission.BOOKINGS_CREATE,
        Permission.BOOKINGS_UPDATE,
    ],
    [role_entity_1.RoleName.USER]: [],
};
//# sourceMappingURL=roles.decorator.js.map