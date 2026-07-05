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
exports.CinemasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cinema_entity_1 = require("./entities/cinema.entity");
let CinemasService = class CinemasService {
    constructor(cinemaRepository) {
        this.cinemaRepository = cinemaRepository;
    }
    async findAll() {
        return this.cinemaRepository.find({
            relations: ['halls'],
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const cinema = await this.cinemaRepository.findOne({
            where: { id },
            relations: ['halls', 'halls.seatLayouts'],
        });
        if (!cinema) {
            throw new common_1.NotFoundException(`Cinéma avec l'ID ${id} non trouvé`);
        }
        return cinema;
    }
    async findByCity(city) {
        return this.cinemaRepository.find({
            where: { city, isActive: true },
            relations: ['halls'],
            order: { name: 'ASC' },
        });
    }
    async create(data) {
        const cinema = this.cinemaRepository.create(data);
        return this.cinemaRepository.save(cinema);
    }
    async update(id, data) {
        const cinema = await this.findOne(id);
        Object.assign(cinema, data);
        return this.cinemaRepository.save(cinema);
    }
    async remove(id) {
        const cinema = await this.findOne(id);
        cinema.isActive = false;
        await this.cinemaRepository.save(cinema);
    }
};
exports.CinemasService = CinemasService;
exports.CinemasService = CinemasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cinema_entity_1.Cinema)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CinemasService);
//# sourceMappingURL=cinemas.service.js.map