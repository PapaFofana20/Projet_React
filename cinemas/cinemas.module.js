"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CinemasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cinema_entity_1 = require("./entities/cinema.entity");
const hall_entity_1 = require("./entities/hall.entity");
const seat_layout_entity_1 = require("./entities/seat-layout.entity");
const cinemas_controller_1 = require("./cinemas.controller");
const cinemas_service_1 = require("./cinemas.service");
const halls_controller_1 = require("./halls.controller");
const halls_service_1 = require("./halls.service");
let CinemasModule = class CinemasModule {
};
exports.CinemasModule = CinemasModule;
exports.CinemasModule = CinemasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cinema_entity_1.Cinema, hall_entity_1.Hall, seat_layout_entity_1.SeatLayout])],
        controllers: [cinemas_controller_1.CinemasController, halls_controller_1.HallsController],
        providers: [cinemas_service_1.CinemasService, halls_service_1.HallsService],
        exports: [typeorm_1.TypeOrmModule],
    })
], CinemasModule);
//# sourceMappingURL=cinemas.module.js.map