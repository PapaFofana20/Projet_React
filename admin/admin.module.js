"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const session_scheduling_service_1 = require("./services/session-scheduling.service");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const user_entity_1 = require("../users/entities/user.entity");
const movie_entity_1 = require("../movies/entities/movie.entity");
const session_entity_1 = require("../sessions/entities/session.entity");
const cinema_entity_1 = require("../cinemas/entities/cinema.entity");
const hall_entity_1 = require("../cinemas/entities/hall.entity");
const seat_layout_entity_1 = require("../cinemas/entities/seat-layout.entity");
const role_entity_1 = require("../auth/entities/role.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                booking_entity_1.Booking,
                user_entity_1.User,
                movie_entity_1.Movie,
                session_entity_1.Session,
                cinema_entity_1.Cinema,
                hall_entity_1.Hall,
                seat_layout_entity_1.SeatLayout,
                role_entity_1.Role,
            ]),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, session_scheduling_service_1.SessionSchedulingService, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard],
        exports: [admin_service_1.AdminService, session_scheduling_service_1.SessionSchedulingService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map