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
exports.HallsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hall_entity_1 = require("./entities/hall.entity");
const seat_layout_entity_1 = require("./entities/seat-layout.entity");
let HallsService = class HallsService {
    constructor(hallRepository, seatLayoutRepository) {
        this.hallRepository = hallRepository;
        this.seatLayoutRepository = seatLayoutRepository;
    }
    async findAll() {
        return this.hallRepository.find({
            relations: ['cinema', 'seatLayouts'],
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const hall = await this.hallRepository.findOne({
            where: { id },
            relations: ['cinema', 'seatLayouts'],
        });
        if (!hall) {
            throw new common_1.NotFoundException(`Salle avec l'ID ${id} non trouvée`);
        }
        return hall;
    }
    async findByCinema(cinemaId) {
        return this.hallRepository.find({
            where: { cinemaId, isActive: true },
            relations: ['seatLayouts'],
            order: { name: 'ASC' },
        });
    }
    async create(data) {
        const hall = this.hallRepository.create(data);
        const savedHall = await this.hallRepository.save(hall);
        const seatGrid = {};
        const vipSeats = [];
        const standardSeats = [];
        const vipRowCount = data.vipRows || 2;
        for (let row = 0; row < data.rowCount; row++) {
            const rowLetter = String.fromCharCode(65 + row);
            for (let seat = 1; seat <= data.seatsPerRow; seat++) {
                const seatId = `${rowLetter}${seat}`;
                const isVip = row >= data.rowCount - vipRowCount;
                seatGrid[seatId] = {
                    type: isVip ? seat_layout_entity_1.SeatType.VIP : seat_layout_entity_1.SeatType.STANDARD,
                    status: seat_layout_entity_1.SeatStatus.AVAILABLE,
                };
                if (isVip) {
                    vipSeats.push(seatId);
                }
                else {
                    standardSeats.push(seatId);
                }
            }
        }
        const seatLayout = this.seatLayoutRepository.create({
            hallId: savedHall.id,
            seatGrid,
            vipSeats,
        });
        await this.seatLayoutRepository.save(seatLayout);
        return this.findOne(savedHall.id);
    }
    async update(id, data) {
        const hall = await this.findOne(id);
        Object.assign(hall, data);
        return this.hallRepository.save(hall);
    }
    async remove(id) {
        const hall = await this.findOne(id);
        hall.isActive = false;
        await this.hallRepository.save(hall);
    }
    async getSeatLayout(hallId) {
        const seatLayout = await this.seatLayoutRepository.findOne({
            where: { hallId },
        });
        if (!seatLayout) {
            throw new common_1.NotFoundException(`Disposition des sièges non trouvée pour la salle ${hallId}`);
        }
        return seatLayout;
    }
    async updateSeat(hallId, seatId, status) {
        const seatLayout = await this.getSeatLayout(hallId);
        if (seatLayout.seatGrid[seatId]) {
            seatLayout.seatGrid[seatId].status = status;
            await this.seatLayoutRepository.save(seatLayout);
        }
        return seatLayout;
    }
};
exports.HallsService = HallsService;
exports.HallsService = HallsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hall_entity_1.Hall)),
    __param(1, (0, typeorm_1.InjectRepository)(seat_layout_entity_1.SeatLayout)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], HallsService);
//# sourceMappingURL=halls.service.js.map