import { HallsService } from './halls.service';
export declare class HallsController {
    private readonly hallsService;
    constructor(hallsService: HallsService);
    findAll(): Promise<import("./entities/hall.entity").Hall[]>;
    findByCinema(cinemaId: number): Promise<import("./entities/hall.entity").Hall[]>;
    findOne(id: number): Promise<import("./entities/hall.entity").Hall>;
    create(data: any): Promise<import("./entities/hall.entity").Hall>;
    update(id: number, data: any): Promise<import("./entities/hall.entity").Hall>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getSeatLayout(id: number): Promise<import("./entities/seat-layout.entity").SeatLayout>;
    updateSeat(id: number, seatId: string, status: string): Promise<import("./entities/seat-layout.entity").SeatLayout>;
}
