import { Repository } from 'typeorm';
import { Hall, ScreenType } from './entities/hall.entity';
import { SeatLayout } from './entities/seat-layout.entity';
export declare class HallsService {
    private readonly hallRepository;
    private readonly seatLayoutRepository;
    constructor(hallRepository: Repository<Hall>, seatLayoutRepository: Repository<SeatLayout>);
    findAll(): Promise<Hall[]>;
    findOne(id: number): Promise<Hall>;
    findByCinema(cinemaId: number): Promise<Hall[]>;
    create(data: {
        cinemaId: number;
        name: string;
        capacity: number;
        rowCount: number;
        seatsPerRow: number;
        screenType: ScreenType;
        basePrice: number;
        vipPrice?: number;
        description?: string;
        vipRows?: number;
    }): Promise<Hall>;
    update(id: number, data: Partial<Hall>): Promise<Hall>;
    remove(id: number): Promise<void>;
    getSeatLayout(hallId: number): Promise<SeatLayout>;
    updateSeat(hallId: number, seatId: string, status: string): Promise<SeatLayout>;
}
